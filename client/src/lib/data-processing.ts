import { McqEvaluation, EssayEvaluation } from "@/types/models";

export function processChartData(mcqData: McqEvaluation[], essayData: EssayEvaluation[]) {
  // Calculate performance by model type
  const reasoningModels = mcqData.filter(d => d.modelType === "Reasoning");
  const nonReasoningModels = mcqData.filter(d => d.modelType === "Non-Reasoning");
  
  const reasoningAvgAccuracy = reasoningModels.length > 0 
    ? reasoningModels.reduce((sum, m) => sum + m.accuracy, 0) / reasoningModels.length 
    : 0;
  
  const nonReasoningAvgAccuracy = nonReasoningModels.length > 0 
    ? nonReasoningModels.reduce((sum, m) => sum + m.accuracy, 0) / nonReasoningModels.length 
    : 0;

  // Calculate cost vs performance data
  const costPerformanceData = mcqData.map(d => ({
    x: d.totalCost,
    y: d.accuracy * 100,
    model: d.model
  }));

  // Calculate strategy performance
  const strategies = ["Default", "Self-Consistency", "Self-Discover"];
  const strategyPerformance = strategies.map(strategy => {
    const matchingEvals = essayData.filter(e => 
      e.strategyShort.includes(strategy) || 
      (strategy === "Default" && e.strategyShort === "Default") ||
      (strategy === "Self-Consistency" && e.strategyShort.includes("Self-Consistency")) ||
      (strategy === "Self-Discover" && e.strategyShort.includes("Self-Discover"))
    );
    
    const avgGrade = matchingEvals.length > 0 
      ? matchingEvals.reduce((sum, e) => sum + e.avgSelfGrade, 0) / matchingEvals.length 
      : 0;
    
    return {
      strategy,
      performance: (avgGrade / 4) * 100 // Convert to percentage (assuming max grade is 4)
    };
  });

  // Performance distribution
  const highPerf = mcqData.filter(d => d.accuracy >= 0.7).length;
  const mediumPerf = mcqData.filter(d => d.accuracy >= 0.5 && d.accuracy < 0.7).length;
  const lowPerf = mcqData.filter(d => d.accuracy < 0.5).length;

  return {
    modelTypeAccuracy: {
      reasoning: reasoningAvgAccuracy * 100,
      nonReasoning: nonReasoningAvgAccuracy * 100
    },
    costPerformanceData,
    strategyPerformance,
    performanceDistribution: {
      high: highPerf,
      medium: mediumPerf,
      low: lowPerf
    }
  };
}

export function sortData<T>(data: T[], key: keyof T, direction: 'asc' | 'desc'): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return 0;
  });
}

export function filterData<T>(data: T[], filters: Partial<T>): T[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      return item[key as keyof T] === value;
    });
  });
}

export function searchData<T>(data: T[], searchTerm: string, searchKeys: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return data;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return data.filter(item =>
    searchKeys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    })
  );
}

export function calculateOverallScores(mcqData: McqEvaluation[], essayData: EssayEvaluation[]) {
  const modelScores: { [key: string]: { mcqScore?: number; essayScore?: number } } = {};

  mcqData.forEach(mcq => {
    if (!modelScores[mcq.model]) {
      modelScores[mcq.model] = {};
    }
    modelScores[mcq.model].mcqScore = mcq.accuracy;
  });

  essayData.forEach(essay => {
    if (!modelScores[essay.model]) {
      modelScores[essay.model] = {};
    }
    modelScores[essay.model].essayScore = essay.avgSelfGrade / 4; // Normalize essay score to be between 0 and 1
  });

  const overallScores: { model: string; overallScore: number }[] = [];

  for (const model in modelScores) {
    const scores = modelScores[model];
    if (scores.mcqScore !== undefined && scores.essayScore !== undefined) {
      overallScores.push({
        model,
        overallScore: (scores.mcqScore + scores.essayScore) / 2,
      });
    }
  }

  return overallScores;
}
