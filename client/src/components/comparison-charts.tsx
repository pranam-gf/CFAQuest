import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { McqEvaluation, EssayEvaluation, PricingInfo } from "@/types/models";
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDisplayName } from "@/lib/model-display-names";
import { getProviderInfo } from "@/lib/provider-mapping";
import { ChartTooltip } from "./chart-tooltip";

interface ComparisonChartsProps {
  selectedModels: string[];
  mcqData: McqEvaluation[] | undefined;
  essayData: EssayEvaluation[] | undefined;
}

// Helper function to get model pricing information (duplicated from compare-page for now)
function getModelPricing(modelId: string): PricingInfo | null {
  const pricingMap: Record<string, PricingInfo> = {
    // OpenAI Models
    'gpt-4o': { inputTokenPrice: 2.5, outputTokenPrice: 10.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1-mini': { inputTokenPrice: 0.40, outputTokenPrice: 1.60, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1-nano': { inputTokenPrice: 0.10, outputTokenPrice: 0.40, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4o-mini': { inputTokenPrice: 0.15, outputTokenPrice: 0.60, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-4.1': { inputTokenPrice: 2.00, outputTokenPrice: 8.00, currency: 'USD', unit: 'per 1M tokens' },
    'o3-mini': { inputTokenPrice: 1.10, outputTokenPrice: 0.55, currency: 'USD', unit: 'per 1M tokens' },
    'o4-mini': { inputTokenPrice: 1.10, outputTokenPrice: 4.40, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5': { inputTokenPrice: 1.25, outputTokenPrice: 10.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5-mini': { inputTokenPrice: 0.25, outputTokenPrice: 2.00, currency: 'USD', unit: 'per 1M tokens' },
    'gpt-5-nano': { inputTokenPrice: 0.05, outputTokenPrice: 0.40, currency: 'USD', unit: 'per 1M tokens' },
    
    // Anthropic Models
    'claude-opus-4': { inputTokenPrice: 15.00, outputTokenPrice: 75.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-opus-4.1': { inputTokenPrice: 15.00, outputTokenPrice: 75.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-opus-4.1-thinking': { inputTokenPrice: 15.00, outputTokenPrice: 75.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-sonnet-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.7-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.5-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'claude-3.5-haiku': { inputTokenPrice: 0.80, outputTokenPrice: 4.0, currency: 'USD', unit: 'per 1M tokens' },
    
    // Google Models
    'gemini-2.5-pro': { inputTokenPrice: 2.5, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'gemini-2.5-flash': { inputTokenPrice: 0.3, outputTokenPrice: 2.50, currency: 'USD', unit: 'per 1M tokens' },
    
    // xAI Models
    'grok-3': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
    'grok-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00, currency: 'USD', unit: 'per 1M tokens' },
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

    // Qwen Models
    'qwen3-32b': { inputTokenPrice: 0.29, outputTokenPrice: 0.59, currency: 'USD', unit: 'per 1M tokens' },

    // Moonshot AI Models
    'kimi-k2': { inputTokenPrice: 1.00, outputTokenPrice: 3.00, currency: 'USD', unit: 'per 1M tokens' },

    // Open Source Models
    'oss-20b': { inputTokenPrice: 0.10, outputTokenPrice: 0.50, currency: 'USD', unit: 'per 1M tokens' },
    'oss-120b': { inputTokenPrice: 0.15, outputTokenPrice: 0.75, currency: 'USD', unit: 'per 1M tokens' },
  };
  
  if (pricingMap[modelId]) {
    return pricingMap[modelId];
  }
  
  for (const [key, pricing] of Object.entries(pricingMap)) {
    if (modelId.includes(key) || key.includes(modelId)) {
      return pricing;
    }
  }
  
  return null;
}


// Minimal legend component
const CleanLegend = ({ data }: any) => {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {data.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ComparisonCharts({ selectedModels, mcqData, essayData }: ComparisonChartsProps) {
  const chartData = selectedModels.map((modelId, index) => {
    // Group MCQ data by model and find the highest accuracy for each model (like hero-performance-chart-v2)
    const modelMcqEntries = mcqData?.filter(m => m.model === modelId) || [];
    const modelMcq = modelMcqEntries.reduce((best, current) => 
      !best || current.accuracy > best.accuracy ? current : best, null as McqEvaluation | null);
    
    // Group essay data by model and find the highest ROUGE-L F1 score for each model (like hero-performance-chart-v2)
    const modelEssayEntries = essayData?.filter(e => e.model === modelId) || [];
    const modelEssay = modelEssayEntries.reduce((best, current) => 
      !best || current.avgRougeLF1 > best.avgRougeLF1 ? current : best, null as EssayEvaluation | null);
    
    const pricing = getModelPricing(modelId);
    const displayName = getDisplayName(modelId);
    
    // Determine model type - prioritize MCQ data, fallback to essay data
    const modelType = modelMcq?.modelType || modelEssay?.modelType || undefined;
    
    return {
      name: displayName.length > 16 ? displayName.substring(0, 16) + '...' : displayName,
      fullName: displayName,
      fullModel: modelId,
      model: modelId,
      provider: getProviderInfo(modelId).name,
      modelType: modelType,
      mcqAccuracy: modelMcq ? modelMcq.accuracy * 100 : 0,
      avgTime: modelMcq ? modelMcq.avgTimePerQuestion : 0,
      essayGrade: modelEssay ? modelEssay.avgSelfGrade : 0,
      cosineSimilarity: modelEssay ? modelEssay.avgCosineSimilarity * 100 : 0,
      totalCost: modelMcq ? modelMcq.totalCost : 0,
      rougeScore: modelEssay ? modelEssay.avgRougeLF1 * 100 : 0, // Using highest ROUGE-L F1 score
      inputTokenPrice: pricing?.inputTokenPrice || 0,
      outputTokenPrice: pricing?.outputTokenPrice || 0,
      pricingEfficiency: pricing && modelMcq && pricing.inputTokenPrice !== undefined && pricing.outputTokenPrice !== undefined ? (modelMcq.accuracy * 100) / (pricing.inputTokenPrice + pricing.outputTokenPrice) : 0,
    };
  });

  if (selectedModels.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <Eye className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Models Selected</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Select models from the leaderboard to compare their performance</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12 space-y-8"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Comprehensive comparison across multiple evaluation metrics
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MCQ Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MCQ Performance</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy and response time comparison</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
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
                dataKey="mcqAccuracy" 
                fill="url(#accuracyGradient)" 
                name="MCQ Accuracy (%)"
                radius={[3, 3, 0, 0]}
              />
              <Bar 
                dataKey="avgTime" 
                fill="url(#timeGradient)" 
                name="Avg Time (s)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#3B82F6', name: 'Accuracy (%)' },
            { color: '#10B981', name: 'Time (s)' }
          ]} />
        </motion.div>

        {/* Essay Grade Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Essay Quality</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Self-evaluation scores</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="essayGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#D97706" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
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
              <Area
                type="monotone"
                dataKey="essayGrade"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#essayGradient)"
                name="Essay Grade"
              />
            </AreaChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#F59E0B', name: 'Essay Grade (0-4)' }
          ]} />
        </motion.div>

        {/* Semantic Similarity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semantic Similarity</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Cosine similarity with reference</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="cosineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
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
              <Area
                type="monotone"
                dataKey="cosineSimilarity"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#cosineGradient)"
                name="Cosine Similarity (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#8B5CF6', name: 'Cosine Similarity (%)' }
          ]} />
        </motion.div>

        {/* ROUGE Score Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ROUGE-L Score</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Text overlap with reference</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="rougeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
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
              <Area
                type="monotone"
                dataKey="rougeScore"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#rougeGradient)"
                name="ROUGE-L F1 (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#10B981', name: 'ROUGE-L F1 (%)' }
          ]} />
        </motion.div>
      </div>

      {/* Pricing Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Token Pricing Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Token Pricing</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Input vs Output token costs (USD per 1M tokens)</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.filter(d => d.inputTokenPrice > 0 || d.outputTokenPrice > 0)} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="inputPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="outputPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#D97706" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              />
              <YAxis 
                domain={[0, 'dataMax']}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              />
              <Tooltip content={<ChartTooltip />} />
              
              <Bar 
                dataKey="inputTokenPrice" 
                fill="url(#inputPriceGradient)" 
                name="Input Token Price ($/1M)"
                radius={[3, 3, 0, 0]}
              />
              <Bar 
                dataKey="outputTokenPrice" 
                fill="url(#outputPriceGradient)" 
                name="Output Token Price ($/1M)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#8B5CF6', name: 'Input Tokens ($/1M)' },
            { color: '#F59E0B', name: 'Output Tokens ($/1M)' }
          ]} />
        </motion.div>

        {/* Price Efficiency Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Efficiency</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy per dollar spent ratio</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData.filter(d => d.pricingEfficiency > 0)} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                angle={-30}
                textAnchor="end"
                height={50}
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
              <Area
                type="monotone"
                dataKey="pricingEfficiency"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#efficiencyGradient)"
                name="Price Efficiency (Acc/$ Ratio)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <CleanLegend data={[
            { color: '#06B6D4', name: 'Efficiency (Acc/$ Ratio)' }
          ]} />
        </motion.div>
      </div>

      {/* Cost Performance Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost vs Performance Analysis</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total cost compared to accuracy scores</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#E11D48" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0891B2" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              angle={-30}
              textAnchor="end"
              height={50}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="totalCost"
              stroke="#F43F5E"
              strokeWidth={2}
              fill="url(#costGradient)"
              name="Total Cost ($)"
            />
            <Area
              type="monotone"
              dataKey="mcqAccuracy"
              stroke="#06B6D4"
              strokeWidth={2}
              fill="url(#performanceGradient)"
              name="MCQ Accuracy (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <CleanLegend data={[
          { color: '#F43F5E', name: 'Total Cost ($)' },
          { color: '#06B6D4', name: 'MCQ Accuracy (%)' }
        ]} />
      </motion.div>
    </motion.div>
  );
}