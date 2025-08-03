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

export interface Statistics {
  totalModels: number;
  bestMcqAccuracy: number;
  bestEssayScore: number;
  mostCostEfficient: number;
  bestMcqModel: string;
  bestEssayModel: string;
  mostCostEfficientModel: string;
}

export type ModelType = "Reasoning" | "Non-Reasoning" | "All";
export type StrategyType = "Default" | "Self-Consistency" | "Self-Discover" | "All";
