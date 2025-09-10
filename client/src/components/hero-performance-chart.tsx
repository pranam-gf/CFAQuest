import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProviderLogo } from "@/components/provider-logo";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { motion } from "framer-motion";
import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";

// Function to get shorter names for chart labels
const getShortDisplayName = (modelId: string): string => {
  const fullName = getDisplayName(modelId);
  
  // Custom short names for common models
  const shortNames: Record<string, string> = {
    'Claude 3.5 Sonnet': 'Claude 3.5S',
    'Claude 3.5 Haiku': 'Claude 3.5H',
    'Claude 3 Opus': 'Claude 3O',
    'Claude 3 Sonnet': 'Claude 3S',
    'Claude 3 Haiku': 'Claude 3H',
    'Claude Sonnet 4': 'Claude S4',
    'Claude Opus 4': 'Claude O4',
    'Claude 3.7 Sonnet': 'Claude 3.7S',
    'GPT-4o': 'GPT-4o',
    'GPT-4o mini': 'GPT-4o mini',
    'GPT-4.1': 'GPT-4.1',
    'GPT-4.1 mini': 'GPT-4.1m',
    'GPT-4.1 nano': 'GPT-4.1n',
    'GPT-4 Turbo': 'GPT-4T',
    'o1 Preview': 'o1',
    'o3-mini': 'o3m',
    'o4-mini': 'o4m',
    'Gemini 2.5 Pro': 'Gemini 2.5P',
    'Gemini 2.5 Flash': 'Gemini 2.5F',
    'Gemini Pro': 'Gemini Pro',
    'Gemini Flash': 'Gemini Flash',
    'Grok 3': 'Grok 3',
    'Grok 3 mini (High)': 'Grok 3m-H',
    'Grok 3 mini (Low)': 'Grok 3m-L',
    'DeepSeek Chat': 'DeepSeek',
    'DeepSeek R1': 'DeepSeek R1',
    'DeepSeek Reasoner': 'DeepSeek-R',
    'Mistral Large': 'Mistral L',
    'Llama 4 Maverick': 'Llama 4M',
    'Llama 4 Scout': 'Llama 4S',
    'Llama 3.1 70B': 'Llama 3.1-70B',
    'Llama 3.1 8B Instant': 'Llama 3.1-8B',
    'Llama 3.2 90B': 'Llama 3.2-90B',
    'Llama 3.2 11B': 'Llama 3.2-11B',
    'Palmyra Fin': 'Palmyra Fin',
    'Command R': 'Command R',
    'Command R+': 'Command R+',
  };
  
  return shortNames[fullName] || fullName;
};

interface ChartDataPoint {
  model: string;
  mcqScore: number; // Y-axis (50-100)
  essayScore: number; // X-axis (2-4)
  provider: string;
  modelType: string;
}

// Helper function to format context length numbers
const formatContextLength = (num: number, modelId: string): string => {
  // Special case for Kimi K2 which has a very large context length (trillion)
  if (modelId.toLowerCase().includes('kimi') && num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(1)}T`;
  }
  
  // For all other models, show exact numbers with comma separators
  return num.toLocaleString();
};

// Helper function to get model pricing information
const getModelPricing = (modelId: string) => {
  const pricingMap: Record<string, { inputTokenPrice: number; outputTokenPrice: number; currency: string; unit: string }> = {
    // OpenAI Models
    'gpt-4o': { inputTokenPrice: 2.5, outputTokenPrice: 10.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1-mini': { inputTokenPrice: 0.40, outputTokenPrice: 1.60, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1-nano': { inputTokenPrice: 0.10, outputTokenPrice: 0.40, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4o-mini': { inputTokenPrice: 0.15, outputTokenPrice: 0.60, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1': { inputTokenPrice: 2.00, outputTokenPrice: 8.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5': { inputTokenPrice: 1.25, outputTokenPrice: 10.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5-mini': { inputTokenPrice: 0.25, outputTokenPrice: 2.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5-nano': { inputTokenPrice: 0.05, outputTokenPrice: 0.40, currency: 'USD', unit: 'per 1M tokens' },
    'o3-mini': { inputTokenPrice: 1.10, outputTokenPrice: 0.55, currency: 'USD', unit: 'per 1M tokens' },
    'o4-mini': { inputTokenPrice: 1.10, outputTokenPrice: 4.40, currency: 'USD', unit: 'per 1M tokens' },
    // Anthropic Models
    'claude-opus-4': { inputTokenPrice: 15.00, outputTokenPrice: 75.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-sonnet-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.7-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.5-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.5-haiku': { inputTokenPrice: 0.80, outputTokenPrice: 4.0, currency: 'USD', unit: 'per 1M tokens' },
    // Google Models
    'gemini-2.5-pro': { inputTokenPrice: 2.5, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'gemini-2.5-flash': { inputTokenPrice: 0.3, outputTokenPrice: 2.50, currency: 'USD', unit: 'per 1M tokens' },
    // xAI Models
    'grok-3': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'grok-3-mini-beta-high-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50, currency: 'USD', unit: 'per 1M tokens' },
    'grok-3-mini-beta-low-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50, currency: 'USD', unit: 'per 1M tokens' },
    // DeepSeek Models
    'deepseek-r1': { inputTokenPrice: 0.75, outputTokenPrice: 0.99, currency: 'USD', unit: 'per 1M tokens' },
    // Mistral Models
    'mistral-large-official': { inputTokenPrice: 2.00, outputTokenPrice: 6.00, currency: 'USD', unit: 'per 1M tokens' },
    // Meta Models
    'groq-llama-4-maverick': { inputTokenPrice: 0.20, outputTokenPrice: 0.60, currency: 'USD', unit: 'per 1M tokens' },
    'groq-llama3.3-70b': { inputTokenPrice: 0.59, outputTokenPrice: 0.79, currency: 'USD', unit: 'per 1M tokens' },
    'groq-llama3.1-8b-instant': { inputTokenPrice: 0.05, outputTokenPrice: 0.08, currency: 'USD', unit: 'per 1M tokens' },
    'groq-llama-4-scout': { inputTokenPrice: 0.11, outputTokenPrice: 0.34, currency: 'USD', unit: 'per 1M tokens' },
    // Writer Models
    'palmyra-fin-default': { inputTokenPrice: 5.00, outputTokenPrice: 12.00, currency: 'USD', unit: 'per 1M tokens' },
    // xAI Additional Models
    'grok-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    // Qwen Models
    'qwen3-32b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59, currency: 'USD', unit: 'per 1M tokens' },
    // Moonshot AI Models
    'kimi-k2': { inputTokenPrice: 1.00, outputTokenPrice: 3.00, currency: 'USD', unit: 'per 1M tokens' },
    // Open Source Models
    'oss-20b': { inputTokenPrice: 0.10, outputTokenPrice: 0.50, currency: 'USD', unit: 'per 1M tokens' },
    'oss-120b': { inputTokenPrice: 0.15, outputTokenPrice: 0.75, currency: 'USD', unit: 'per 1M tokens' },
  };
  
  // Try exact match first
  if (pricingMap[modelId]) {
    return pricingMap[modelId];
  }
  
  // Try partial matching for model families
  for (const [key, pricing] of Object.entries(pricingMap)) {
    if (modelId.includes(key) || key.includes(modelId)) {
      return pricing;
    }
  }
  
  return null;
};

// Helper function to get model website
const getModelWebsite = (modelId: string): string | null => {
  const providerInfo = getProviderInfo(modelId);
  const websiteMap: Record<string, string> = {
    'OpenAI': 'https://openai.com',
    'Anthropic': 'https://anthropic.com',
    'Google': 'https://ai.google.dev',
    'DeepSeek': 'https://deepseek.com',
    'Mistral': 'https://mistral.ai',
    'Cohere': 'https://cohere.com',
    'Meta': 'https://ai.meta.com',
    'xAI': 'https://x.ai',
    'Groq': 'https://groq.com',
    'Writer': 'https://writer.com',
    'Alibaba': 'https://qwen.com',
    'Moonshot AI': 'https://moonshot.cn',
  };
  
  return websiteMap[providerInfo.name] || null;
};

const CleanTooltip = ({ active, payload, label, mcqData, essayData }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const providerInfo = getProviderInfo(data.model);
    const pricing = getModelPricing(data.model);
    const website = getModelWebsite(data.model);
    
    // Get context length from the data
    const modelMcq = mcqData?.find((m: any) => m.model === data.model);
    const modelEssay = essayData?.find((e: any) => e.model === data.model);
    const contextLength = modelMcq?.contextLength || modelEssay?.contextLength;

    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-4 shadow-xl max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <ProviderLogo modelName={data.model} size="sm" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{getDisplayName(data.model)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{providerInfo.name}</p>
          </div>
        </div>
        
        {/* Performance Section */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-600 dark:text-gray-400 text-xs">MCQ Accuracy:</span>
            <span className="font-medium text-gray-800 dark:text-white text-xs">{data.mcqScore.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-600 dark:text-gray-400 text-xs">Essay Score:</span>
            <span className="font-medium text-gray-800 dark:text-white text-xs">{data.essayScore.toFixed(3)} (avg)</span>
          </div>
        </div>

        {/* Model Info Section */}
        {(contextLength || website || pricing) && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              {contextLength && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Context Length:</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatContextLength(contextLength, data.model)}</span>
                </div>
              )}
              
              {website && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Website:</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">{website.replace('https://', '')}</span>
                </div>
              )}

              {pricing && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pricing (USD):</div>
                  {pricing.inputTokenPrice && (
                    <div className="flex justify-between items-center pl-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Input:</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">${pricing.inputTokenPrice}/1M</span>
                    </div>
                  )}
                  {pricing.outputTokenPrice && (
                    <div className="flex justify-between items-center pl-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Output:</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">${pricing.outputTokenPrice}/1M</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
  return null;
};

export function HeroPerformanceChart() {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<'all' | 'reasoning' | 'non-reasoning'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: mcqData = [] } = useQuery<McqEvaluation[]>({ queryKey: ["/api/mcq-evaluations"] });
  const { data: essayData = [] } = useQuery<EssayEvaluation[]>({ queryKey: ["/api/essay-evaluations"] });

  const chartData: ChartDataPoint[] = [];
  const mcqMap = new Map(mcqData.map(item => [item.model, item]));
  const essayMap = new Map(essayData.map(item => [item.model, item]));
  const allModels = new Set([...mcqData.map(m => m.model), ...essayData.map(e => e.model)]);

  allModels.forEach(model => {
    const mcqItem = mcqMap.get(model);
    const essayItem = essayMap.get(model);
    if (mcqItem && essayItem) {
      chartData.push({
        model,
        mcqScore: mcqItem.accuracy * 100,
        essayScore: (essayItem.avgRougeLF1 + essayItem.avgSelfGrade) / 2, // Average of ROUGE-L F1 and self grade
        provider: getProviderInfo(model).name,
        modelType: mcqItem.modelType || essayItem.modelType || 'Unknown',
      });
    }
  });

  // Separate data by model type
  const reasoningModels = chartData.filter(point => point.modelType === 'Reasoning');
  const nonReasoningModels = chartData.filter(point => point.modelType !== 'Reasoning');

  // Filter data based on selected filter type
  const getFilteredData = () => {
    switch (filterType) {
      case 'reasoning':
        return reasoningModels;
      case 'non-reasoning':
        return nonReasoningModels;
      default:
        return chartData;
    }
  };

  const filteredData = getFilteredData();

  // Sort both arrays by essayScore for connecting lines
  reasoningModels.sort((a, b) => a.essayScore - b.essayScore);
  nonReasoningModels.sort((a, b) => a.essayScore - b.essayScore);

  // Fixed width to fit properly without horizontal scaling
  const width = 1100;
  const height = 700;
  const margin = { top: 100, right: 100, bottom: 120, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate dynamic bounds based on filtered data with more padding
  const xValues = filteredData.map(d => d.essayScore);
  const yValues = filteredData.map(d => d.mcqScore);
  
  // Fixed X-axis range for better spacing and less clutter
  const xMin = 0.75;
  const xMax = 1.79;
  const yMin = Math.max(Math.min(...yValues) - 5, 0);
  const yMax = Math.min(Math.max(...yValues) + 5, 100);

  // Even linear scaling for maximum spacing
  const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * chartWidth;
  
  const yScale = (value: number) => chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  // Generate evenly spaced ticks for the focused range (0.75 to 1.79)
  const xTicks = [];
  const xStep = (xMax - xMin) / 10; // Create 10 intervals for good spacing
  for (let i = 0; i <= 10; i++) {
    const tickValue = xMin + (i * xStep);
    xTicks.push(Math.round(tickValue * 100) / 100); // Round to 2 decimal places
  }
  
  // Generate detailed Y ticks with more granular values
  const yTicks = [];
  const yStart = Math.floor(yMin / 5) * 5; // Start at nearest 5
  const yEnd = Math.ceil(yMax / 5) * 5; // End at nearest 5
  
  for (let i = yStart; i <= yEnd; i += 5) {
    if (i >= yMin && i <= yMax) {
      yTicks.push(i);
    }
  }

  // Create label position maps for alternating top/bottom positions
  const getLabelPositions = (models: ChartDataPoint[]) => {
    const labelPositions = new Map<string, 'top' | 'bottom' | 'hidden'>();
    const sortedByXPosition = [...models].sort((a, b) => a.essayScore - b.essayScore);
    
    const topLabelsX: number[] = [];
    const bottomLabelsX: number[] = [];
    const minPixelDistance = 50; // Adjust this threshold

    sortedByXPosition.forEach((model, index) => {
      const currentX = margin.left + xScale(model.essayScore);
      const position = index % 2 === 0 ? 'top' : 'bottom';
      let collision = false;

      if (position === 'top') {
        for (const x of topLabelsX) {
          if (Math.abs(currentX - x) < minPixelDistance) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          topLabelsX.push(currentX);
        }
      } else { // bottom
        for (const x of bottomLabelsX) {
          if (Math.abs(currentX - x) < minPixelDistance) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          bottomLabelsX.push(currentX);
        }
      }

      if (collision) {
        labelPositions.set(model.model, 'hidden');
      } else {
        labelPositions.set(model.model, position);
      }
    });
    
    return labelPositions;
  };

  const reasoningLabelPositions = getLabelPositions(reasoningModels);
  const nonReasoningLabelPositions = getLabelPositions(nonReasoningModels);

  const handleMouseMove = (e: React.MouseEvent, point: ChartDataPoint) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setHoveredPoint(point);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative w-full">
      {chartData.length === 0 ? (
        <div
          className="flex items-center justify-center bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10 w-full"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <div className="text-slate-600 dark:text-slate-400">Loading performance data...</div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-w-fit flex justify-center"
          >
            <svg ref={svgRef} width={width} height={height} className="rounded-xl bg-transparent">
              <defs>
                <clipPath id="chart-area">
                  <rect 
                    x={margin.left} 
                    y={margin.top} 
                    width={chartWidth} 
                    height={chartHeight} 
                  />
                </clipPath>
              </defs>
              <g className="grid">
                {xTicks.map(tick => (
                  <line key={`x-grid-${tick}`} x1={margin.left + xScale(tick)} y1={margin.top} x2={margin.left + xScale(tick)} y2={margin.top + chartHeight} stroke="currentColor" strokeOpacity={0.1} className="text-slate-400 dark:text-slate-600" />
                ))}
                {yTicks.map(tick => (
                  <line key={`y-grid-${tick}`} x1={margin.left} y1={margin.top + yScale(tick)} x2={margin.left + chartWidth} y2={margin.top + yScale(tick)} stroke="currentColor" strokeOpacity={0.1} className="text-slate-400 dark:text-slate-600" />
                ))}
              </g>

              <g className="axes">
                <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} stroke="currentColor" className="text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
                <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke="currentColor" className="text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
              </g>

              <g className="axis-labels">
                {xTicks.map(tick => (
                  <g key={`x-tick-${tick}`}>
                    <line
                      x1={margin.left + xScale(tick)}
                      y1={margin.top + chartHeight}
                      x2={margin.left + xScale(tick)}
                      y2={margin.top + chartHeight + 6}
                      stroke="currentColor"
                      className="text-slate-600 dark:text-slate-300"
                      strokeWidth={1}
                    />
                    <text 
                      x={margin.left + xScale(tick)} 
                      y={margin.top + chartHeight + 20} 
                      textAnchor="middle" 
                      className="text-xs fill-slate-600 dark:fill-slate-400"
                    >
                      {tick}
                    </text>
                  </g>
                ))}
                {yTicks.map(tick => (
                  <g key={`y-tick-${tick}`}>
                    <line
                      x1={margin.left - 6}
                      y1={margin.top + yScale(tick)}
                      x2={margin.left}
                      y2={margin.top + yScale(tick)}
                      stroke="currentColor"
                      className="text-slate-600 dark:text-slate-300"
                      strokeWidth={1}
                    />
                    <text 
                      x={margin.left - 5} 
                      y={margin.top + yScale(tick)} 
                      textAnchor="end" 
                      dominantBaseline="middle" 
                      className="text-xs fill-slate-600 dark:fill-slate-400"
                    >
                      {tick}%
                    </text>
                  </g>
                ))}
                <text x={margin.left + chartWidth / 2} y={margin.top + chartHeight + 50} textAnchor="middle" className="text-sm font-medium fill-slate-700 dark:fill-slate-300">Essay Score (ROUGE-L + Self Grade Avg)</text>
                <text x={-margin.top - chartHeight / 2} y={12} textAnchor="middle" transform="rotate(-90)" className="text-sm font-medium fill-slate-700 dark:fill-slate-300">MCQ Accuracy (%)</text>
              </g>

              {/* Connecting lines for reasoning models */}
              <g className={`reasoning-line transition-all duration-200 ${hoveredPoint ? 'hidden' : ''} ${filterType === 'non-reasoning' ? 'opacity-20' : ''}`} clipPath="url(#chart-area)">
                {reasoningModels.length > 1 && (filterType === 'all' || filterType === 'reasoning') && (
                  <path
                    d={reasoningModels.map((point, index) => 
                      `${index === 0 ? 'M' : 'L'} ${margin.left + xScale(point.essayScore)} ${margin.top + yScale(point.mcqScore)}`
                    ).join(' ')}
                    stroke="rgb(16, 185, 129)"
                    strokeWidth={2}
                    fill="none"
                    strokeOpacity={0.6}
                    strokeDasharray="4,4"
                  />
                )}
              </g>

              {/* Connecting lines for non-reasoning models */}
              <g className={`non-reasoning-line transition-all duration-200 ${hoveredPoint ? 'hidden' : ''} ${filterType === 'reasoning' ? 'opacity-20' : ''}`} clipPath="url(#chart-area)">
                {nonReasoningModels.length > 1 && (filterType === 'all' || filterType === 'non-reasoning') && (
                  <path
                    d={nonReasoningModels.map((point, index) => 
                      `${index === 0 ? 'M' : 'L'} ${margin.left + xScale(point.essayScore)} ${margin.top + yScale(point.mcqScore)}`
                    ).join(' ')}
                    stroke="rgb(59, 130, 246)"
                    strokeWidth={2}
                    fill="none"
                    strokeOpacity={0.6}
                    strokeDasharray="8,4"
                  />
                )}
              </g>

              <g className="data-points">
                {chartData.map((point, index) => {
                  const isVisible = filterType === 'all' || 
                    (filterType === 'reasoning' && point.modelType === 'Reasoning') ||
                    (filterType === 'non-reasoning' && point.modelType !== 'Reasoning');
                  
                  return (
                  <motion.g
                    key={point.model}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0.1, 
                      scale: isVisible ? 1 : 0.8 
                    }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                  >
                    {hoveredPoint?.model === point.model && (
                      <circle cx={margin.left + xScale(point.essayScore)} cy={margin.top + yScale(point.mcqScore)} r={20} fill="currentColor" className="text-blue-400 dark:text-blue-300" fillOpacity={0.2} />
                    )}
                    
                    {/* Model name label - alternating top/bottom positions */}
                    {(() => {
                      const isReasoning = point.modelType === 'Reasoning';
                      const labelPosition = isReasoning 
                        ? reasoningLabelPositions.get(point.model) 
                        : nonReasoningLabelPositions.get(point.model);
                      
                      if (!labelPosition || labelPosition === 'hidden') return null;
                      
                      const yOffset = labelPosition === 'top' ? -25 : 35;
                      
                      return (
                        <text
                          x={margin.left + xScale(point.essayScore)}
                          y={margin.top + yScale(point.mcqScore) + yOffset}
                          textAnchor="middle"
                          className={`text-xs font-medium fill-slate-700 dark:fill-slate-300 pointer-events-none transition-all duration-200 ${
                            hoveredPoint && hoveredPoint.model !== point.model ? 'hidden' : ''
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          {getShortDisplayName(point.model)}
                        </text>
                      );
                    })()}
                    
                    <foreignObject x={margin.left + xScale(point.essayScore) - 16} y={margin.top + yScale(point.mcqScore) - 16} width={32} height={32} className="cursor-pointer" onMouseMove={(e) => handleMouseMove(e, point)} onMouseLeave={handleMouseLeave}>
                      <div className={`w-8 h-8 transition-all duration-200 ${
                        hoveredPoint?.model === point.model 
                          ? 'scale-125 drop-shadow-lg' 
                          : hoveredPoint 
                            ? 'hover:scale-110 opacity-0' 
                            : 'hover:scale-110'
                      } overflow-visible flex items-center justify-center`}>
                        <ProviderLogo modelName={point.model} className="w-7 h-7" />
                      </div>
                    </foreignObject>
                  </motion.g>
                  );
                })}
              </g>

              {/* Legend - positioned at bottom right */}
              <g className="legend" opacity="0.9">
                
                {/* Reasoning Models Legend */}
                <g 
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => setFilterType(filterType === 'reasoning' ? 'all' : 'reasoning')}
                >
                  <line
                    x1={margin.left + chartWidth - 130}
                    y1={margin.top + chartHeight - 65}
                    x2={margin.left + chartWidth - 110}
                    y2={margin.top + chartHeight - 65}
                    stroke="rgb(16, 185, 129)"
                    strokeWidth={filterType === 'reasoning' ? 3 : 2}
                    strokeDasharray="4,4"
                    strokeOpacity={filterType === 'non-reasoning' ? 0.3 : 1}
                  />
                  <text
                    x={margin.left + chartWidth - 105}
                    y={margin.top + chartHeight - 61}
                    className={`text-xs ${filterType === 'reasoning' ? 'fill-emerald-600 dark:fill-emerald-400 font-semibold' : 'fill-slate-700 dark:fill-slate-300'}`}
                    dominantBaseline="middle"
                    opacity={filterType === 'non-reasoning' ? 0.5 : 1}
                  >
                    Reasoning Models
                  </text>
                </g>
                
                {/* Non-Reasoning Models Legend */}
                <g 
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => setFilterType(filterType === 'non-reasoning' ? 'all' : 'non-reasoning')}
                >
                  <line
                    x1={margin.left + chartWidth - 130}
                    y1={margin.top + chartHeight - 45}
                    x2={margin.left + chartWidth - 110}
                    y2={margin.top + chartHeight - 45}
                    stroke="rgb(59, 130, 246)"
                    strokeWidth={filterType === 'non-reasoning' ? 3 : 2}
                    strokeDasharray="8,4"
                    strokeOpacity={filterType === 'reasoning' ? 0.3 : 1}
                  />
                  <text
                    x={margin.left + chartWidth - 105}
                    y={margin.top + chartHeight - 41}
                    className={`text-xs ${filterType === 'non-reasoning' ? 'fill-blue-600 dark:fill-blue-400 font-semibold' : 'fill-slate-700 dark:fill-slate-300'}`}
                    dominantBaseline="middle"
                    opacity={filterType === 'reasoning' ? 0.5 : 1}
                  >
                    Non-Reasoning Models
                  </text>
                </g>
              </g>
            </svg>
          </motion.div>

          {hoveredPoint && (
            <div className="absolute z-50 pointer-events-none" style={{ left: tooltipPosition.x + 8, top: tooltipPosition.y - 8, transform: tooltipPosition.x > width / 2 ? 'translateX(-100%)' : 'translateX(0)' }}>
              <CleanTooltip active={true} payload={[{ payload: hoveredPoint }]} label={hoveredPoint.model} mcqData={mcqData} essayData={essayData} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
