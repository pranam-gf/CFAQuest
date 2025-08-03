import postgres from "postgres";
import { type McqEvaluation, type EssayEvaluation } from "../shared/schema";

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

export class DatabaseStorage {
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
        // Transform snake_case to camelCase
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
          contextLength: row.context_length ? Number(row.context_length) : undefined,
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
        // Transform snake_case to camelCase
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
          modelType: row.model_type || 'Non-Reasoning', // Default value if not present
          contextLength: row.context_length ? Number(row.context_length) : undefined,
        };
        const key = `${essay.model}-${essay.strategyShort}`;
        this.essayData.set(key, essay);
      }
      console.log(`Loaded ${essayResults.length} essay evaluations`);

      this.loaded = true;
      console.log("✅ All data loaded successfully from database");
    } catch (error) {
      console.error("❌ Failed to load data from database:", error);
      // Don't throw the error, just log it and continue with empty data
      // This prevents the function from crashing if the database is temporarily unavailable
      this.loaded = true; // Mark as loaded to prevent retries
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