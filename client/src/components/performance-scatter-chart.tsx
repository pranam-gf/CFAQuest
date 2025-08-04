import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderLogo } from "@/components/provider-logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { formatContextLength, getContextLengthColor } from "@/lib/context-length-utils";
import { getDisplayName } from "@/lib/model-display-names";

interface ChartDataPoint {
  model: string;
  mcqScore: number; // Y-axis (0-100)
  essayScore: number; // X-axis (0-4)
  mcqAccuracy: number;
  essayGrade: number;
  overallScore: number;
  provider: string;
  modelType: string;
  contextLength?: number;
  strategy?: string;
  totalCost?: number;
  avgTime?: number;
}

interface PerformanceScatterChartProps {
  mcqData: McqEvaluation[];
  essayData: EssayEvaluation[];
  className?: string;
}

export function PerformanceScatterChart({ mcqData, essayData, className }: PerformanceScatterChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Combine data from both MCQ and Essay evaluations
  const chartData: ChartDataPoint[] = [];
  
  // Create a map of models for quick lookup
  const mcqMap = new Map(mcqData.map(item => [item.model, item]));
  const essayMap = new Map(essayData.map(item => [item.model, item]));
  
  // Get all unique models
  const allModels = new Set([...mcqData.map(m => m.model), ...essayData.map(e => e.model)]);
  
  allModels.forEach(model => {
    const mcqItem = mcqMap.get(model);
    const essayItem = essayMap.get(model);
    
    // Only include models that have both MCQ and Essay data
    if (mcqItem && essayItem) {
      chartData.push({
        model,
        mcqScore: mcqItem.accuracy * 100, // Convert to percentage for Y-axis
        essayScore: essayItem.avgSelfGrade, // 0-4 scale for X-axis
        mcqAccuracy: mcqItem.accuracy,
        essayGrade: essayItem.avgSelfGrade,
        overallScore: (mcqItem.accuracy * 100 + essayItem.avgSelfGrade * 25) / 2, // Simple overall calculation
        provider: model.split('/')[0] || model.split('-')[0] || 'Unknown',
        modelType: mcqItem.modelType || essayItem.modelType || 'Unknown',
        contextLength: mcqItem.contextLength || essayItem.contextLength,
        strategy: mcqItem.strategy,
        totalCost: mcqItem.totalCost,
        avgTime: mcqItem.avgTimePerQuestion
      });
    }
  });

  // Chart dimensions and margins
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 60, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scales
  const xMin = 0;
  const xMax = 4;
  const yMin = 0;
  const yMax = 100;

  const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (value: number) => chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  // Grid lines
  const xTicks = [0, 1, 2, 3, 4];
  const yTicks = [0, 20, 40, 60, 80, 100];

  const handleMouseMove = (e: React.MouseEvent, point: ChartDataPoint) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    setHoveredPoint(point);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 dark:text-white">
          Performance Comparison: MCQ vs Essay
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          X-axis: Essay Performance (0-4) • Y-axis: MCQ Accuracy (0-100%)
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          >
            {/* Grid lines */}
            <g className="grid">
              {/* Vertical grid lines */}
              {xTicks.map(tick => (
                <line
                  key={`x-grid-${tick}`}
                  x1={margin.left + xScale(tick)}
                  y1={margin.top}
                  x2={margin.left + xScale(tick)}
                  y2={margin.top + chartHeight}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  className="text-gray-400 dark:text-gray-600"
                />
              ))}
              {/* Horizontal grid lines */}
              {yTicks.map(tick => (
                <line
                  key={`y-grid-${tick}`}
                  x1={margin.left}
                  y1={margin.top + yScale(tick)}
                  x2={margin.left + chartWidth}
                  y2={margin.top + yScale(tick)}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  className="text-gray-400 dark:text-gray-600"
                />
              ))}
            </g>

            {/* Axes */}
            <g className="axes">
              {/* X-axis */}
              <line
                x1={margin.left}
                y1={margin.top + chartHeight}
                x2={margin.left + chartWidth}
                y2={margin.top + chartHeight}
                stroke="currentColor"
                className="text-gray-600 dark:text-gray-300"
                strokeWidth={2}
              />
              {/* Y-axis */}
              <line
                x1={margin.left}
                y1={margin.top}
                x2={margin.left}
                y2={margin.top + chartHeight}
                stroke="currentColor"
                className="text-gray-600 dark:text-gray-300"
                strokeWidth={2}
              />
            </g>

            {/* Axis labels */}
            <g className="axis-labels">
              {/* X-axis ticks and labels */}
              {xTicks.map(tick => (
                <g key={`x-label-${tick}`}>
                  <line
                    x1={margin.left + xScale(tick)}
                    y1={margin.top + chartHeight}
                    x2={margin.left + xScale(tick)}
                    y2={margin.top + chartHeight + 6}
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-300"
                    strokeWidth={1}
                  />
                  <text
                    x={margin.left + xScale(tick)}
                    y={margin.top + chartHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 dark:fill-gray-300"
                  >
                    {tick}
                  </text>
                </g>
              ))}
              {/* Y-axis ticks and labels */}
              {yTicks.map(tick => (
                <g key={`y-label-${tick}`}>
                  <line
                    x1={margin.left - 6}
                    y1={margin.top + yScale(tick)}
                    x2={margin.left}
                    y2={margin.top + yScale(tick)}
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-300"
                    strokeWidth={1}
                  />
                  <text
                    x={margin.left - 12}
                    y={margin.top + yScale(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-600 dark:fill-gray-300"
                  >
                    {tick}%
                  </text>
                </g>
              ))}
            </g>

            {/* Axis titles */}
            <text
              x={margin.left + chartWidth / 2}
              y={height - 10}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
            >
              Essay Performance (Self Grade)
            </text>
            <text
              x={20}
              y={margin.top + chartHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(-90 20 ${margin.top + chartHeight / 2})`}
              className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
            >
              MCQ Accuracy (%)
            </text>

            {/* Data points */}
            <g className="data-points">
              {chartData.map((point, index) => (
                <g key={point.model}>
                  {/* Glow effect for hovered point */}
                  {hoveredPoint?.model === point.model && (
                    <circle
                      cx={margin.left + xScale(point.essayScore)}
                      cy={margin.top + yScale(point.mcqScore)}
                      r={20}
                      fill="currentColor"
                      className="text-blue-400 dark:text-blue-300"
                      fillOpacity={0.2}
                    />
                  )}
                  
                  {/* Provider logo as data point */}
                  <foreignObject
                    x={margin.left + xScale(point.essayScore) - 12}
                    y={margin.top + yScale(point.mcqScore) - 12}
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    onMouseMove={(e) => handleMouseMove(e, point)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      hoveredPoint?.model === point.model 
                        ? 'border-blue-500 scale-125 shadow-lg' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    } ${point.modelType === 'Reasoning' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <ProviderLogo modelName={point.model} className="w-full h-full" />
                    </div>
                  </foreignObject>
                </g>
              ))}
            </g>
          </svg>

          {/* Custom tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-50 pointer-events-none"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: tooltipPosition.x > width/2 ? 'translateX(-100%)' : 'translateX(0)'
              }}
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-64">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ProviderLogo modelName={hoveredPoint.model} className="w-5 h-5" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {getDisplayName(hoveredPoint.model)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">MCQ Accuracy:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {hoveredPoint.mcqScore.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Essay Grade:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {hoveredPoint.essayScore.toFixed(2)}/4
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Overall:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {hoveredPoint.overallScore.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <Badge variant={hoveredPoint.modelType === 'Reasoning' ? 'default' : 'secondary'} className="text-xs">
                        {hoveredPoint.modelType}
                      </Badge>
                    </div>
                  </div>

                  {hoveredPoint.contextLength && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Context: </span>
                      <span className={`font-medium ${getContextLengthColor(hoveredPoint.contextLength)}`}>
                        {formatContextLength(hoveredPoint.contextLength)}
                      </span>
                    </div>
                  )}

                  {hoveredPoint.totalCost && (
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Cost: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${hoveredPoint.totalCost.toFixed(2)}
                        </span>
                      </div>
                      {hoveredPoint.avgTime && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Avg Time: </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {hoveredPoint.avgTime.toFixed(1)}s
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-50 dark:bg-green-900/20"></div>
            <span>Reasoning Models</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"></div>
            <span>Non-Reasoning Models</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Hover over points to see detailed model information
          </div>
        </div>
      </CardContent>
    </Card>
  );
}