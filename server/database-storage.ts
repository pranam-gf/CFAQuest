import postgres from "postgres";
import { type McqEvaluation, type EssayEvaluation } from "@shared/schema";

let client: postgres.Sql | null = null;

function getDatabase() {
  if (!client) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    client = postgres(databaseUrl);
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
      const mcqResults = await db`SELECT * FROM mcq_evaluations`;
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
        };
        const key = `${mcq.model}-${mcq.strategy}`;
        this.mcqData.set(key, mcq);
      }
      console.log(`Loaded ${mcqResults.length} MCQ evaluations`);

      console.log("Loading essay evaluations from database...");
      const essayResults = await db`SELECT * FROM essay_evaluations`;
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
        };
        const key = `${essay.model}-${essay.strategyShort}`;
        this.essayData.set(key, essay);
      }
      console.log(`Loaded ${essayResults.length} essay evaluations`);

      this.loaded = true;
      console.log("✅ All data loaded successfully from database");
    } catch (error) {
      console.error("❌ Failed to load data from database:", error);
      throw error;
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