export interface McqEvaluation {
  id: string;
  model: string;
  strategy: string;
  accuracy: number;
  avgTimePerQuestion: number;
  totalApiResponseTime: number;
  totalOutputTokens: number;
  avgAnswerLength: number;
  totalCost: number;
  numProcessed: number;
  configIdUsed: string;
  sourceJson: string;
  modelType: string;
  contextLength?: number;
}

export interface EssayEvaluation {
  id: string;
  model: string;
  strategyShort: string;
  totalTokens: number;
  totalApiCost: number;
  avgCosineSimilarity: number;
  avgRougeLF1: number;
  avgSelfGrade: number;
  avgLatencyMs: number;
  cosinePerDollar: number;
  sampleCount: number;
  modelType: string;
  contextLength?: number;
}

export type InsertMcqEvaluation = Omit<McqEvaluation, 'id'>;
export type InsertEssayEvaluation = Omit<EssayEvaluation, 'id'>;
