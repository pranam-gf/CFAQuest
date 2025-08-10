import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { processChartData } from "@/lib/data-processing";
import { motion } from 'framer-motion';

import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";
import { ChartTooltip, ScatterChartTooltip } from "@/components/chart-tooltip";

// Helper function to get consistent provider colors
const getProviderColor = (provider: string) => {
  const colors: Record<string, string> = {
    'OpenAI': '#3B82F6',
    'Anthropic': '#10B981', 
    'Google': '#F59E0B',
    'Meta': '#8B5CF6',
    'Cohere': '#EF4444',
    'Mistral': '#06B6D4',
    'DeepSeek': '#F97316',
    'xAI': '#84CC16',
    'Writer': '#EC4899',
    'Unknown': '#6B7280'
  };
  return colors[provider] || '#6B7280';
};

// Helper function for strategy display names
const getStrategyDisplayName = (strategy: string) => {
  const displayNames: Record<string, string> = {
    'Default (Single Pass)': 'Zero-Shot',
    'Default': 'Zero-Shot',
    'Self-Consistency CoT (N=3 samples)': 'Self-Consistency N=3',
    'Self-Consistency_N3': 'Self-Consistency N=3',
    'Self-Consistency CoT (N=5 samples)': 'Self-Consistency N=5', 
    'Self-Consistency_N5': 'Self-Consistency N=5',
    'Self-Discover': 'Self-Discover'
  };
  return displayNames[strategy] || strategy;
};

// Specific tooltip for pie charts that handles the data structure differently
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    
    // Helper function to determine if logo should be inverted in dark mode
    const getDarkModeLogoClass = (providerName: string): string => {
      const darkLogos = ['Writer', 'xAI', 'Anthropic', 'OpenAI'];
      return darkLogos.includes(providerName) ? 'dark:invert dark:brightness-0' : '';
    };
    
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {data.payload.name}
              {getProviderInfo(data.payload.name).logo && (
                <span className="ml-2 inline-flex items-center w-4 h-4 flex-shrink-0">
                  {(() => {
                     const LogoComponent = getProviderInfo(data.payload.name).logo;
                     const darkModeClass = getDarkModeLogoClass(data.payload.name);
                     return typeof LogoComponent === 'function'
                       ? <LogoComponent className={`w-4 h-4 flex-shrink-0 ${darkModeClass}`} style={{ width: '16px', height: '16px' }} />
                       : LogoComponent;
                   })()}
                </span>
              )}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {data.payload.value} models
          </span>
        </div>
      </div>
    );
  }
  return null;
};


export function PerformanceCharts() {
  const { data: mcqData = [] } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [] } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const chartData = processChartData(mcqData, essayData);

  // MCQ Model Type Data
  const mcqModelTypeData = [
    { name: "Reasoning Models", accuracy: chartData.modelTypeAccuracy.reasoning },
    { name: "Non-Reasoning Models", accuracy: chartData.modelTypeAccuracy.nonReasoning },
  ];

  // Essay Model Type Data (calculate from essay data)
  const essayModelTypeData = [
    { 
      name: "Reasoning Models", 
      accuracy: essayData.filter(e => e.modelType === "Reasoning").reduce((acc, e, _, arr) => acc + (e.avgSelfGrade / arr.length), 0) * 25 // Convert to percentage scale
    },
    { 
      name: "Non-Reasoning Models", 
      accuracy: essayData.filter(e => e.modelType !== "Reasoning").reduce((acc, e, _, arr) => acc + (e.avgSelfGrade / arr.length), 0) * 25 // Convert to percentage scale
    },
  ];

  // Model Distribution by Provider - Get unique models first, then count by provider
  const allModels = [...mcqData, ...essayData];
  const uniqueModels = Array.from(new Set(allModels.map(m => m.model)))
    .map(modelName => {
      // Extract provider using getProviderInfo
      const provider = getProviderInfo(modelName).name;
      return {
        model: modelName,
        provider: provider
      };
    });

  const providerData = uniqueModels.reduce((acc: any, model) => {
    const provider = model.provider;
    acc[provider] = (acc[provider] || 0) + 1;
    return acc;
  }, {});
  
  const modelDistributionData = Object.entries(providerData).map(([provider, count]) => ({
    name: provider,
    value: count as number,
    color: getProviderColor(provider)
  }));

  // Strategy Performance with proper naming
  const strategyData = chartData.strategyPerformance.map(strategy => ({
    ...strategy,
    strategy: getStrategyDisplayName(strategy.strategy)
  }));

  const pieData = [
    { name: "High Performance (70%+)", value: chartData.performanceDistribution.high, color: "#3B82F6" },
    { name: "Medium Performance (50-70%)", value: chartData.performanceDistribution.medium, color: "#10B981" },
    { name: "Low Performance (<50%)", value: chartData.performanceDistribution.low, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-8">
      {/* First Row - MCQ and Essay Accuracy */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
      {/* MCQ Accuracy by Model Type */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MCQ Accuracy by Model Type</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Reasoning vs Non-Reasoning Models</p>
        </div>
        
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mcqModelTypeData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="mcqBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar 
              dataKey="accuracy" 
              fill="url(#mcqBarGradient)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Essay Accuracy by Model Type */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Essay Accuracy by Model Type</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Reasoning vs Non-Reasoning Models</p>
        </div>
        
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={essayModelTypeData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="essayBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar 
              dataKey="accuracy" 
              fill="url(#essayBarGradient)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      </motion.div>

      {/* Second Row - Performance Distribution and Model Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Performance Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Distribution</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Model performance categories</p>
          </div>
          
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Model Distribution by Provider */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Distribution</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Models by organization</p>
          </div>
          
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={modelDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {modelDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {modelDistributionData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Third Row - Cost vs Performance Analysis (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost vs Performance Analysis</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Efficiency scatter plot visualization</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={chartData.costPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              type="number"
              dataKey="x" 
              name="Cost" 
              unit="$" 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <YAxis 
              type="number"
              dataKey="y" 
              name="Accuracy" 
              unit="%" 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Tooltip content={<ScatterChartTooltip />} />
            <Scatter 
              dataKey="y" 
              fill="#3B82F6"
              fillOpacity={0.7}
              stroke="#1D4ED8"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Fourth Row - Strategy Performance (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategy Performance</h3>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl w-full">
          {strategyData.map((strategy, index) => (
            <motion.div
              key={strategy.strategy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{strategy.strategy}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Performance Score</p>
              </div>
              <div className="relative">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {strategy.performance.toFixed(1)}%
                </div>
                <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${strategy.performance}%` }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}