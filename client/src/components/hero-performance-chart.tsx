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

const CleanTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <ProviderLogo modelName={data.model} size="sm" />
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{getDisplayName(data.model)}</p>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-gray-600 dark:text-gray-400">MCQ Accuracy:</span>
            <span className="font-medium text-gray-800 dark:text-white">{data.mcqScore.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Essay Score:</span>
            <span className="font-medium text-gray-800 dark:text-white">{data.essayScore.toFixed(2)}/4</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function HeroPerformanceChart() {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
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
        essayScore: essayItem.avgSelfGrade,
        provider: getProviderInfo(model).name,
        modelType: mcqItem.modelType || essayItem.modelType || 'Unknown',
      });
    }
  });

  // Separate data by model type
  const reasoningModels = chartData.filter(point => point.modelType === 'Reasoning');
  const nonReasoningModels = chartData.filter(point => point.modelType !== 'Reasoning');

  // Sort both arrays by essayScore for connecting lines
  reasoningModels.sort((a, b) => a.essayScore - b.essayScore);
  nonReasoningModels.sort((a, b) => a.essayScore - b.essayScore);

  // Fixed width to fit properly without horizontal scaling
  const width = 1100;
  const height = 700;
  const margin = { top: 100, right: 100, bottom: 120, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate dynamic bounds based on actual data with more padding
  const xValues = chartData.map(d => d.essayScore);
  const yValues = chartData.map(d => d.mcqScore);
  
  const xMin = 2.5;
  const xMax = 3.5;
  const yMin = Math.max(Math.min(...yValues) - 5, 0);
  const yMax = Math.min(Math.max(...yValues) + 5, 100);

  // Even linear scaling for maximum spacing
  const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * chartWidth;
  
  const yScale = (value: number) => chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  // Generate ticks with smaller intervals for better fit
  const xTicks = [];
  for (let i = xMin; i <= xMax; i += 0.1) {
    xTicks.push(Math.round(i * 10) / 10);
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
    const labelPositions = new Map<string, 'top' | 'bottom'>();
    const sortedByXPosition = [...models].sort((a, b) => a.essayScore - b.essayScore);
    
    sortedByXPosition.forEach((model, index) => {
      labelPositions.set(model.model, index % 2 === 0 ? 'top' : 'bottom');
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
                <text x={margin.left + chartWidth / 2} y={margin.top + chartHeight + 50} textAnchor="middle" className="text-sm font-medium fill-slate-700 dark:fill-slate-300">Essay Evaluation Score</text>
                <text x={-margin.top - chartHeight / 2} y={12} textAnchor="middle" transform="rotate(-90)" className="text-sm font-medium fill-slate-700 dark:fill-slate-300">MCQ Accuracy (%)</text>
              </g>

              {/* Connecting lines for reasoning models */}
              <g className="reasoning-line">
                {reasoningModels.length > 1 && (
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
              <g className="non-reasoning-line">
                {nonReasoningModels.length > 1 && (
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
                {chartData.map((point, index) => (
                  <motion.g
                    key={point.model}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
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
                      
                      if (!labelPosition) return null;
                      
                      const yOffset = labelPosition === 'top' ? -25 : 35;
                      
                      return (
                        <text
                          x={margin.left + xScale(point.essayScore)}
                          y={margin.top + yScale(point.mcqScore) + yOffset}
                          textAnchor="middle"
                          className="text-xs font-medium fill-slate-700 dark:fill-slate-300 pointer-events-none"
                          style={{ fontSize: '10px' }}
                        >
                          {getShortDisplayName(point.model)}
                        </text>
                      );
                    })()}
                    
                    <foreignObject x={margin.left + xScale(point.essayScore) - 16} y={margin.top + yScale(point.mcqScore) - 16} width={32} height={32} className="cursor-pointer" onMouseMove={(e) => handleMouseMove(e, point)} onMouseLeave={handleMouseLeave}>
                      <div className={`w-8 h-8 transition-all duration-200 ${hoveredPoint?.model === point.model ? 'scale-125 drop-shadow-lg' : 'hover:scale-110'} overflow-visible flex items-center justify-center`}>
                        <ProviderLogo modelName={point.model} className="w-7 h-7" />
                      </div>
                    </foreignObject>
                  </motion.g>
                ))}
              </g>

              {/* Minimal transparent legend - positioned near x-axis value 3.5 */}
              <g className="legend" opacity="0.8">
                <rect
                  x={margin.left + xScale(3.5) - 90}
                  y={margin.top + chartHeight - 90}
                  width={180}
                  height={35}
                  fill="white"
                  fillOpacity="0.1"
                  stroke="none"
                  rx={4}
                />
                
                {/* Reasoning Models Legend */}
                <line
                  x1={margin.left + xScale(3.5) - 75}
                  y1={margin.top + chartHeight - 80}
                  x2={margin.left + xScale(3.5) - 55}
                  y2={margin.top + chartHeight - 80}
                  stroke="rgb(16, 185, 129)"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                  opacity="0.7"
                />
                <text
                  x={margin.left + xScale(3.5) - 50}
                  y={margin.top + chartHeight - 76}
                  className="text-xs fill-slate-600 dark:fill-slate-400"
                  dominantBaseline="middle"
                  opacity="0.8"
                >
                  Reasoning Models
                </text>
                
                {/* Non-Reasoning Models Legend */}
                <line
                  x1={margin.left + xScale(3.5) - 75}
                  y1={margin.top + chartHeight - 65}
                  x2={margin.left + xScale(3.5) - 55}
                  y2={margin.top + chartHeight - 65}
                  stroke="rgb(59, 130, 246)"
                  strokeWidth={2}
                  strokeDasharray="8,4"
                  opacity="0.7"
                />
                <text
                  x={margin.left + xScale(3.5) - 50}
                  y={margin.top + chartHeight - 61}
                  className="text-xs fill-slate-600 dark:fill-slate-400"
                  dominantBaseline="middle"
                  opacity="0.8"
                >
                  Non-Reasoning Models
                </text>
              </g>
            </svg>
          </motion.div>

          {hoveredPoint && (
            <div className="absolute z-50 pointer-events-none" style={{ left: tooltipPosition.x + 8, top: tooltipPosition.y - 8, transform: tooltipPosition.x > width / 2 ? 'translateX(-100%)' : 'translateX(0)' }}>
              <CleanTooltip active={true} payload={[{ payload: hoveredPoint }]} label={hoveredPoint.model} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
