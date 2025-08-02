// This file serves as the entry point for the Vercel serverless function.
// It includes the server logic directly to avoid module resolution issues.

import express, { type Request, Response, NextFunction } from "express";
import postgres from "postgres";
import { type McqEvaluation, type EssayEvaluation } from "../shared/schema";

// Database client
let client: postgres.Sql | null = null;

function getDatabase() {
  if (!client) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL environment variable is missing");
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    console.log("Initializing database connection...");
    try {
      client = postgres(databaseUrl, {
        max: 1, // Limit connections for serverless
        idle_timeout: 20,
        connect_timeout: 10,
      });
      console.log("Database client created successfully");
    } catch (error) {
      console.error("Failed to create database client:", error);
      throw error;
    }
  }
  return client;
}

// Database storage class
class DatabaseStorage {
  private static instance: DatabaseStorage;
  private mcqData: Map<string, McqEvaluation> = new Map();
  private essayData: Map<string, EssayEvaluation> = new Map();
  private loaded = false;

  static getInstance(): DatabaseStorage {
    if (!DatabaseStorage.instance) {
      DatabaseStorage.instance = new DatabaseStorage();
    }
    return DatabaseStorage.instance;
  }

  async loadData(): Promise<void> {
    if (this.loaded) {
      console.log("Data already loaded, skipping...");
      return;
    }

    try {
      const db = getDatabase();
      
      console.log("Loading MCQ evaluations from database...");
      const mcqResults = await Promise.race([
        db`SELECT * FROM mcq_evaluations`,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 10000)
        )
      ]) as any[];
      
      this.mcqData.clear();
      for (const row of mcqResults) {
        const mcq: McqEvaluation = {
          id: row.id,
          model: row.model,
          strategy: row.strategy,
          accuracy: Number(row.accuracy),
          avgTimePerQuestion: Number(row.avg_time_per_question),
          totalApiResponseTime: Number(row.total_api_response_time),
          totalOutputTokens: Number(row.total_output_tokens),
          avgAnswerLength: Number(row.avg_answer_length),
          totalCost: Number(row.total_cost),
          numProcessed: Number(row.num_processed),
          configIdUsed: row.config_id_used,
          sourceJson: row.source_json,
          modelType: row.model_type,
        };
        const key = `${mcq.model}-${mcq.strategy}`;
        this.mcqData.set(key, mcq);
      }
      console.log(`Loaded ${mcqResults.length} MCQ evaluations`);

      console.log("Loading essay evaluations from database...");
      const essayResults = await Promise.race([
        db`SELECT * FROM essay_evaluations`,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 10000)
        )
      ]) as any[];
      
      this.essayData.clear();
      for (const row of essayResults) {
        const essay: EssayEvaluation = {
          id: row.id,
          model: row.model,
          strategyShort: row.strategy_short,
          totalTokens: Number(row.total_tokens),
          totalApiCost: Number(row.total_api_cost),
          avgCosineSimilarity: Number(row.avg_cosine_similarity),
          avgRougeLF1: Number(row.avg_rouge_l_f1),
          avgSelfGrade: Number(row.avg_self_grade),
          avgLatencyMs: Number(row.avg_latency_ms),
          cosinePerDollar: Number(row.cosine_per_dollar),
          sampleCount: Number(row.sample_count),
          modelType: row.model_type || 'Non-Reasoning',
        };
        const key = `${essay.model}-${essay.strategyShort}`;
        this.essayData.set(key, essay);
      }
      console.log(`Loaded ${essayResults.length} essay evaluations`);

      this.loaded = true;
      console.log("✅ All data loaded successfully from database");
    } catch (error) {
      console.error("❌ Failed to load data from database:", error);
      this.loaded = true;
      console.log("⚠️ Continuing with empty data due to database error");
    }
  }

  getMcqEvaluations(): McqEvaluation[] {
    return Array.from(this.mcqData.values());
  }

  getEssayEvaluations(): EssayEvaluation[] {
    return Array.from(this.essayData.values());
  }

  async close(): Promise<void> {
    if (client) {
      await client.end();
      client = null;
    }
  }
}

// Routes registration
async function registerRoutes(app: express.Application): Promise<void> {
  const storage = DatabaseStorage.getInstance();

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Get MCQ evaluations
  app.get("/api/mcq-evaluations", (req, res) => {
    try {
      const evaluations = storage.getMcqEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching MCQ evaluations:", error);
      res.status(500).json({ error: "Failed to fetch MCQ evaluations" });
    }
  });

  // Get essay evaluations
  app.get("/api/essay-evaluations", (req, res) => {
    try {
      const evaluations = storage.getEssayEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching essay evaluations:", error);
      res.status(500).json({ error: "Failed to fetch essay evaluations" });
    }
  });
}

// Setup function for initializing the app
const setupApp = async (): Promise<express.Application> => {
  const app = express();
  
  console.log('Setting up app...');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
  });
  
  // Load data from database
  try {
    console.log('Initializing database storage...');
    const storage = DatabaseStorage.getInstance();
    await storage.loadData();
    console.log('Database storage initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database storage:', error);
    throw error;
  }
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(logLine);
      }
    });

    next();
  });

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  return app;
};

// Create and export the app instance for Vercel
let appInstance: express.Application | null = null;

export default async (req: any, res: any) => {
  try {
    if (!appInstance) {
      console.log('Initializing app for Vercel...');
      appInstance = await setupApp();
      console.log('App initialized successfully');
    }
    return appInstance(req, res);
  } catch (error) {
    console.error('Error in Vercel function:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
