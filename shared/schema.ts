import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mcqEvaluations = pgTable("mcq_evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  model: text("model").notNull(),
  strategy: text("strategy").notNull(),
  accuracy: real("accuracy").notNull(),
  avgTimePerQuestion: real("avg_time_per_question").notNull(),
  totalApiResponseTime: real("total_api_response_time").notNull(),
  totalOutputTokens: integer("total_output_tokens").notNull(),
  avgAnswerLength: real("avg_answer_length").notNull(),
  totalCost: real("total_cost").notNull(),
  numProcessed: integer("num_processed").notNull(),
  configIdUsed: text("config_id_used").notNull(),
  sourceJson: text("source_json").notNull(),
  modelType: text("model_type").notNull(),
});

export const essayEvaluations = pgTable("essay_evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  model: text("model").notNull(),
  strategyShort: text("strategy_short").notNull(),
  totalTokens: real("total_tokens").notNull(),
  totalApiCost: real("total_api_cost").notNull(),
  avgCosineSimilarity: real("avg_cosine_similarity").notNull(),
  avgRougeLF1: real("avg_rouge_l_f1").notNull(),
  avgSelfGrade: real("avg_self_grade").notNull(),
  avgLatencyMs: real("avg_latency_ms").notNull(),
  cosinePerDollar: real("cosine_per_dollar").notNull(),
  sampleCount: integer("sample_count").notNull(),
});

export const insertMcqEvaluationSchema = createInsertSchema(mcqEvaluations).omit({
  id: true,
});

export const insertEssayEvaluationSchema = createInsertSchema(essayEvaluations).omit({
  id: true,
});

export type InsertMcqEvaluation = z.infer<typeof insertMcqEvaluationSchema>;
export type InsertEssayEvaluation = z.infer<typeof insertEssayEvaluationSchema>;
export type McqEvaluation = typeof mcqEvaluations.$inferSelect;
export type EssayEvaluation = typeof essayEvaluations.$inferSelect;
