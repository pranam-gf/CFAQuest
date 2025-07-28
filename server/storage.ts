import { type McqEvaluation, type EssayEvaluation, type InsertMcqEvaluation, type InsertEssayEvaluation } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export interface IStorage {
  getMcqEvaluations(): Promise<McqEvaluation[]>;
  getEssayEvaluations(): Promise<EssayEvaluation[]>;
  loadDataFromCsv(): Promise<void>;
}

export class MemStorage implements IStorage {
  private mcqEvaluations: Map<string, McqEvaluation>;
  private essayEvaluations: Map<string, EssayEvaluation>;

  constructor() {
    this.mcqEvaluations = new Map();
    this.essayEvaluations = new Map();
  }

  async getMcqEvaluations(): Promise<McqEvaluation[]> {
    return Array.from(this.mcqEvaluations.values());
  }

  async getEssayEvaluations(): Promise<EssayEvaluation[]> {
    return Array.from(this.essayEvaluations.values());
  }

  async loadDataFromCsv(): Promise<void> {
    try {
      // Load MCQ data
      const mcqCsvPath = path.resolve(process.cwd(), "attached_assets", "all_runs_summary_metrics_1753717485485.csv");
      const mcqCsvContent = fs.readFileSync(mcqCsvPath, "utf-8");
      const mcqRecords = parse(mcqCsvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      for (const record of mcqRecords) {
        const r = record as Record<string, string>;
        if (r.Model && r.Strategy && r.Accuracy) {
          const id = randomUUID();
          const mcqEvaluation: McqEvaluation = {
            id,
            model: r.Model,
            strategy: r.Strategy,
            accuracy: parseFloat(r.Accuracy) || 0,
            avgTimePerQuestion: parseFloat(r["Avg Time/Q (s)"]) || 0,
            totalApiResponseTime: parseFloat(r["Total API Response Time (s)"]) || 0,
            totalOutputTokens: parseInt(r["Total Output Tokens"]) || 0,
            avgAnswerLength: parseFloat(r["Avg Ans Len"]) || 0,
            totalCost: parseFloat(r["Total Cost ($)"]) || 0,
            numProcessed: parseInt(r["Num Processed"]) || 0,
            configIdUsed: r["Config ID Used"] || "",
            sourceJson: r["Source JSON"] || "",
            modelType: r["Model Type"] || "",
          };
          this.mcqEvaluations.set(id, mcqEvaluation);
        }
      }

      // Load Essay data
      const essayCsvPath = path.resolve(process.cwd(), "attached_assets", "model_strategy_summary_metrics_1753717485485.csv");
      const essayCsvContent = fs.readFileSync(essayCsvPath, "utf-8");
      const essayRecords = parse(essayCsvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      for (const record of essayRecords) {
        const r = record as Record<string, string>;
        if (r.model && r.strategy_short) {
          const id = randomUUID();
          const essayEvaluation: EssayEvaluation = {
            id,
            model: r.model,
            strategyShort: r.strategy_short,
            totalTokens: parseFloat(r.total_tokens) || 0,
            totalApiCost: parseFloat(r.total_api_cost) || 0,
            avgCosineSimilarity: parseFloat(r.avg_cosine_similarity) || 0,
            avgRougeLF1: parseFloat(r.avg_rouge_l_f1) || 0,
            avgSelfGrade: parseFloat(r.avg_self_grade) || 0,
            avgLatencyMs: parseFloat(r.avg_latency_ms) || 0,
            cosinePerDollar: parseFloat(r.cosine_per_dollar) || 0,
            sampleCount: parseInt(r.sample_count) || 0,
            modelType: this.determineModelType(r.model),
          };
          this.essayEvaluations.set(id, essayEvaluation);
        }
      }

      console.log(`Loaded ${this.mcqEvaluations.size} MCQ evaluations and ${this.essayEvaluations.size} essay evaluations`);
    } catch (error) {
      console.error("Error loading CSV data:", error);
    }
  }

  private determineModelType(modelName: string): string {
    const reasoning_models = ['deepseek-r1', 'o1', 'o3', 'qwq', 'grok'];
    const model = modelName.toLowerCase();
    return reasoning_models.some(rm => model.includes(rm)) ? "Reasoning" : "Non-Reasoning";
  }
}

export const storage = new MemStorage();
