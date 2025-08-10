import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { motion } from "framer-motion";
import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";
import { ProviderLogo } from "@/components/provider-logo";

// Function to get shorter names for chart labels
const getShortDisplayName = (modelId: string): string => {
  const fullName = getDisplayName(modelId);
  const shortNames: Record<string, string> = {
    'Claude 3.5 Sonnet': 'C3.5S',
    'GPT-4o': 'GPT-4o',
    'Gemini 2.5 Pro': 'G2.5P',
    'Llama 3.1 70B': 'L3.1-70B',
  };
  return shortNames[fullName] || fullName.slice(0, 10);
};

interface ChartDataPoint {
  model: string;
  mcqScore: number;
  essayScore: number;
  provider: string;
}

const getBarColor = (index: number): string => {
  const top3Colors = ['#D4A574', '#6B7280', '#A0522D'];
  if (index < top3Colors.length) {
    return top3Colors[index];
  }
  return '#E5E7EB'; // Consistent light gray for the rest
};

// Custom navigation component with underline effect
interface MetricNavProps {
  activeMetric: 'mcq' | 'essay';
  onMetricChange: (metric: 'mcq' | 'essay') => void;
}

const MetricNavigation = ({ activeMetric, onMetricChange }: MetricNavProps) => {
  return (
    <nav className="flex items-center space-x-2">
      <button
        onClick={() => onMetricChange('mcq')}
        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
          activeMetric === 'mcq' ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <span className="relative z-10">MCQ Accuracy</span>
        {activeMetric === 'mcq' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
            style={{
              boxShadow: "0px 0px 8px 0px #3b82f6",
            }}
            layoutId="chart-metric-underline"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => onMetricChange('essay')}
        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
          activeMetric === 'essay' ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <span className="relative z-10">Essay Score</span>
        {activeMetric === 'essay' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
            style={{
              boxShadow: "0px 0px 8px 0px #3b82f6",
            }}
            layoutId="chart-metric-underline"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    </nav>
  );
};

export function HeroPerformanceChartV2() {
  const [activeMetric, setActiveMetric] = useState<'mcq' | 'essay'>('mcq');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: mcqData = [] } = useQuery<McqEvaluation[]>({ queryKey: ["/api/mcq-evaluations"] });
  const { data: essayData = [] } = useQuery<EssayEvaluation[]>({ queryKey: ["/api/essay-evaluations"] });

  const chartData = useMemo((): ChartDataPoint[] => {
    const mcqMap = new Map(mcqData.map(item => [item.model, item]));
    const essayMap = new Map(essayData.map(item => [item.model, item]));
    const allModels = new Set([...mcqData.map(m => m.model), ...essayData.map(e => e.model)]);
    
    const data: ChartDataPoint[] = [];
    allModels.forEach(model => {
      const mcqItem = mcqMap.get(model);
      const essayItem = essayMap.get(model);
      if (mcqItem && essayItem) {
        data.push({
          model,
          mcqScore: mcqItem.accuracy * 100,
          essayScore: essayItem.avgSelfGrade,
          provider: getProviderInfo(model).name,
        });
      }
    });
    return data;
  }, [mcqData, essayData]);

  const sortedData = useMemo(() => {
    return [...chartData].sort((a, b) => {
      const scoreA = activeMetric === 'mcq' ? a.mcqScore : a.essayScore;
      const scoreB = activeMetric === 'mcq' ? b.mcqScore : b.essayScore;
      return scoreB - scoreA;
    }).slice(0, 10); // Show only top 10 models
  }, [chartData, activeMetric]);

  const maxScore = activeMetric === 'mcq' ? 100 : 4.0;

  const width = 1100;
  const height = 700;
  const margin = { top: 100, right: 100, bottom: 150, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const handleMetricChange = (newMetric: 'mcq' | 'essay') => {
    if (newMetric === activeMetric) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMetric(newMetric);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  if (chartData.length === 0) {
    return <div className="w-full h-[700px] flex items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (isTransitioning) {
    return (
      <div className="relative w-full overflow-x-auto">
        {/* Navigation positioned at top right */}
        <div className="absolute top-4 right-4 z-10">
          <MetricNavigation 
            activeMetric={activeMetric}
            onMetricChange={handleMetricChange}
          />
        </div>
        
        <div className="min-w-fit flex justify-center">
          <svg width={width} height={height} className="rounded-xl bg-transparent">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Y-axis and Grid Lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = chartHeight - (i / 4) * chartHeight;
                const value = (i / 4) * maxScore;
                return (
                  <g key={i} className="text-gray-400 dark:text-gray-600">
                    <line x1={0} y1={y} x2={chartWidth} y2={y} className="stroke-current opacity-50" strokeDasharray="2,2" />
                    <text x={-10} y={y + 4} textAnchor="end" className="text-xs fill-current">{
                      activeMetric === 'mcq' ? `${value.toFixed(0)}%` : value.toFixed(1)
                    }</text>
                  </g>
                );
              })}

              {/* X-axis */}
              <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} className="stroke-gray-400 dark:stroke-gray-600" />
              
              {/* Y-axis label */}
              <text
                x={-chartHeight / 2}
                y={-50}
                textAnchor="middle"
                transform={`rotate(-90, -${chartHeight / 2}, -50)`}
                className="text-base font-semibold fill-gray-700 dark:fill-gray-300"
              >
                {activeMetric === 'mcq' ? 'MCQ Accuracy (%)' : 'Essay Score (0-4)'}
              </text>
              
              {/* Updating message */}
              <text 
                x={chartWidth / 2} 
                y={chartHeight / 2} 
                textAnchor="middle" 
                className="text-lg fill-gray-500 dark:fill-gray-400"
              >
                Updating chart...
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-auto">
      {/* Navigation positioned at top right */}
      <div className="absolute top-4 right-4 z-10">
        <MetricNavigation 
          activeMetric={activeMetric}
          onMetricChange={handleMetricChange}
        />
      </div>
      
      <div className="min-w-fit flex justify-center">
        <svg width={width} height={height} className="rounded-xl bg-transparent">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y-axis and Grid Lines */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = chartHeight - (i / 4) * chartHeight;
              const value = (i / 4) * maxScore;
              return (
                <g key={i} className="text-gray-400 dark:text-gray-600">
                  <line x1={0} y1={y} x2={chartWidth} y2={y} className="stroke-current opacity-50" strokeDasharray="2,2" />
                  <text x={-10} y={y + 4} textAnchor="end" className="text-xs fill-current">{
                    activeMetric === 'mcq' ? `${value.toFixed(0)}%` : value.toFixed(1)
                  }</text>
                </g>
              );
            })}

            {/* X-axis */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} className="stroke-gray-400 dark:stroke-gray-600" />
            
            {/* Y-axis label */}
            <text
              x={-chartHeight / 2}
              y={-50}
              textAnchor="middle"
              transform={`rotate(-90, -${chartHeight / 2}, -50)`}
              className="text-base font-semibold fill-gray-700 dark:fill-gray-300"
            >
              {activeMetric === 'mcq' ? 'MCQ Accuracy (%)' : 'Essay Score (0-4)'}
            </text>
            
            {/* X-axis labels (model names) */}
            {sortedData.map((p, index) => {
              const slotWidth = chartWidth / sortedData.length;
              const xPos = index * slotWidth + slotWidth / 2;
              
              return (
                <text
                  key={`x-label-${p.model}-${activeMetric}`}
                  x={xPos}
                  y={chartHeight + 35}
                  textAnchor="end"
                  className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
                  transform={`rotate(-35, ${xPos}, ${chartHeight + 35})`}
                >
                  {getDisplayName(p.model)}
                </text>
              );
            })}

            {/* Bars and Labels */}
            {sortedData.map((p, index) => {
              const score = activeMetric === 'mcq' ? p.mcqScore : p.essayScore;
              const barHeight = (score / maxScore) * chartHeight;
              const displayScore = activeMetric === 'mcq' ? `${score.toFixed(1)}%` : score.toFixed(2);
              
              const slotWidth = chartWidth / sortedData.length;
              const barWidth = slotWidth * 0.6;
              const xPos = index * slotWidth;
              const barTopY = chartHeight - barHeight;

              return (
                <g 
                  key={`${p.model}-${activeMetric}`} 
                  transform={`translate(${xPos}, 0)`}
                >
                  {/* Bar */}
                  <motion.rect
                    key={`bar-${p.model}-${activeMetric}`}
                    x={(slotWidth - barWidth) / 2}
                    y={barTopY > 0 ? barTopY : 0}
                    width={barWidth}
                    height={barHeight > 0 ? barHeight : 0}
                    fill={getBarColor(index)}
                    rx={2}
                    className="hover:opacity-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  />

                  {/* Score Label (Inside Bar) */}
                  <motion.text 
                    x={slotWidth / 2}
                    y={barTopY + (activeMetric === 'mcq' ? 30 : 22)}
                    textAnchor="middle"
                    className="text-xs font-bold fill-black/70 dark:fill-white/80 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 + 0.3, ease: "backOut" }}
                  >
                    {displayScore}
                  </motion.text>
                  
                  {/* Provider Logo (On Top of Bar) */}
                  <motion.foreignObject
                    x={slotWidth / 2 - 16}
                    y={barTopY - (activeMetric === 'mcq' ? 60 : 50)}
                    width="32"
                    height="32"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 + 0.4, ease: "backOut" }}
                  >
                    <ProviderLogo modelName={p.model} size="md" />
                  </motion.foreignObject>

                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}