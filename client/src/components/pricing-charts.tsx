import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, Area, AreaChart } from "recharts";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { motion } from 'framer-motion';
import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";

// Get model pricing from compare-page.tsx pricing map
function getModelPricing(modelId: string) {
  const pricingMap: Record<string, { inputTokenPrice: number; outputTokenPrice: number }> = {
    // OpenAI Models
    'gpt-4o': { inputTokenPrice: 2.5, outputTokenPrice: 10.00 },
    'gpt-4.1-mini': { inputTokenPrice: 0.40, outputTokenPrice: 1.60 },
    'gpt-4.1-nano': { inputTokenPrice: 0.10, outputTokenPrice: 0.40 },
    'gpt-4o-mini': { inputTokenPrice: 0.15, outputTokenPrice: 0.60 },
    'gpt-4.1': { inputTokenPrice: 2.00, outputTokenPrice: 8.00 },
    'o3-mini': { inputTokenPrice: 1.10, outputTokenPrice: 0.55 },
    'o4-mini': { inputTokenPrice: 1.10, outputTokenPrice: 4.40 },
    
    // Anthropic Models
    'claude-opus-4': { inputTokenPrice: 15.00, outputTokenPrice: 75.00 },
    'claude-sonnet-4': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
    'claude-3.7-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
    'claude-3.5-sonnet': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
    'claude-3.5-haiku': { inputTokenPrice: 0.80, outputTokenPrice: 4.0 },
    
    // Google Models
    'gemini-2.5-pro': { inputTokenPrice: 2.5, outputTokenPrice: 15.00 },
    'gemini-2.5-flash': { inputTokenPrice: 0.3, outputTokenPrice: 2.50 },
    
    // xAI Models
    'grok-3': { inputTokenPrice: 3.00, outputTokenPrice: 15.00 },
    'grok-3-mini-beta-high-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50 },
    'grok-3-mini-beta-low-effort': { inputTokenPrice: 0.30, outputTokenPrice: 0.50 },
    
    // DeepSeek Models
    'deepseek-r1': { inputTokenPrice: 0.75, outputTokenPrice: 0.99 },
    
    // Mistral Models
    'mistral-large-official': { inputTokenPrice: 2.00, outputTokenPrice: 6.00 },
   
    // Meta Models
    'groq-llama-4-maverick': { inputTokenPrice: 0.20, outputTokenPrice: 0.60 },
    'groq-llama3.3-70b': { inputTokenPrice: 0.59, outputTokenPrice: 0.79 },
    'groq-llama3.1-8b-instant': { inputTokenPrice: 0.05, outputTokenPrice: 0.08 },
    'groq-llama-4-scout': { inputTokenPrice: 0.11, outputTokenPrice: 0.34 },
    
    // Writer Models
    'palmyra-fin-default': { inputTokenPrice: 5.00, outputTokenPrice: 12.00 },
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
}

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

// Clean tooltip for charts
const CleanTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 shadow-xl">
        <p className="font-medium text-gray-900 dark:text-white mb-2 text-sm">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {entry.name || entry.dataKey}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {typeof entry.value === 'number' ? (
                  entry.dataKey === 'accuracy' ? `${entry.value.toFixed(1)}%` :
                  entry.dataKey?.includes('Price') ? `$${entry.value.toFixed(2)}` :
                  entry.value.toFixed(2)
                ) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function PricingCharts() {
  const { data: mcqData = [], isLoading: isLoadingMcq } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [], isLoading: isLoadingEssay } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const isLoading = isLoadingMcq || isLoadingEssay;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  // Combine all models with pricing data
  const allModels = [...mcqData, ...essayData];
  const uniqueModels = Array.from(new Set(allModels.map(m => m.model)))
    .map(modelName => {
      const mcqModel = mcqData.find(m => m.model === modelName);
      const essayModel = essayData.find(m => m.model === modelName);
      const pricing = getModelPricing(modelName);
      const provider = getProviderInfo(modelName).name;
      
      if (!pricing) return null;
      
      return {
        model: getDisplayName(modelName),
        fullModel: modelName,
        provider,
        accuracy: mcqModel ? mcqModel.accuracy * 100 : 0,
        essayScore: essayModel ? essayModel.avgSelfGrade : 0,
        inputPrice: pricing.inputTokenPrice,
        outputPrice: pricing.outputTokenPrice,
        avgPrice: (pricing.inputTokenPrice + pricing.outputTokenPrice) / 2,
        totalCost: mcqModel ? mcqModel.totalCost : essayModel ? essayModel.totalApiCost : 0,
        modelType: mcqModel?.modelType || essayModel?.modelType || 'Non-Reasoning'
      };
    })
    .filter(Boolean);

  // Price vs Performance scatter data
  const priceVsPerformance = uniqueModels.map(model => ({
    x: model!.avgPrice,
    y: model!.accuracy,
    model: model!.model,
    provider: model!.provider,
    totalCost: model!.totalCost,
    color: getProviderColor(model!.provider)
  }));

  // Provider average pricing
  const providerPricing = uniqueModels.reduce((acc: any, model) => {
    if (!model) return acc;
    if (!acc[model.provider]) {
      acc[model.provider] = {
        provider: model.provider,
        totalPrice: 0,
        count: 0,
        accuracy: 0
      };
    }
    acc[model.provider].totalPrice += model.avgPrice;
    acc[model.provider].accuracy += model.accuracy;
    acc[model.provider].count += 1;
    return acc;
  }, {});

  const providerAvgData = Object.values(providerPricing).map((provider: any) => ({
    provider: provider.provider,
    avgPrice: provider.totalPrice / provider.count,
    avgAccuracy: provider.accuracy / provider.count,
    color: getProviderColor(provider.provider)
  }));

  // Input vs Output pricing comparison
  const pricingComparisonData = uniqueModels.slice(0, 10).map(model => ({
    model: model!.model.length > 15 ? model!.model.substring(0, 15) + '...' : model!.model,
    inputPrice: model!.inputPrice,
    outputPrice: model!.outputPrice,
    fullModel: model!.model
  }));

  // Cost efficiency (performance per dollar)
  const costEfficiencyData = uniqueModels
    .map(model => ({
      model: model!.model,
      efficiency: model!.accuracy / model!.avgPrice, // accuracy per dollar
      accuracy: model!.accuracy,
      price: model!.avgPrice,
      provider: model!.provider
    }))
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Price vs Performance Scatter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Price vs Performance Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Model pricing ($/1M tokens) vs MCQ accuracy performance
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={priceVsPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              dataKey="x" 
              name="Average Price" 
              unit="$" 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <YAxis 
              dataKey="y" 
              name="Accuracy" 
              unit="%" 
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Tooltip content={<CleanTooltip />} />
            <Scatter 
              dataKey="y" 
              fill="#10B981"
              fillOpacity={0.7}
              stroke="#059669"
              strokeWidth={2}
              r={6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two column layout for remaining charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provider Average Pricing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Provider Average Pricing
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average cost per 1M tokens by organization
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={providerAvgData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="providerPricingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="provider" 
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              />
              <Tooltip content={<CleanTooltip />} />
              <Bar 
                dataKey="avgPrice" 
                fill="url(#providerPricingGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost Efficiency Ranking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cost Efficiency Ranking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Performance per dollar (accuracy / avg price)
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costEfficiencyData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
              <XAxis 
                dataKey="model" 
                tick={{ fontSize: 9, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              />
              <Tooltip content={<CleanTooltip />} />
              <Bar 
                dataKey="efficiency" 
                fill="url(#efficiencyGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Input vs Output Pricing - Full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Input vs Output Token Pricing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comparison of input and output token costs ($/1M tokens)
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={pricingComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} className="text-gray-400" />
            <XAxis 
              dataKey="model" 
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
              tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Tooltip content={<CleanTooltip />} />
            <Bar dataKey="inputPrice" fill="#3B82F6" name="Input Price" radius={[2, 2, 0, 0]} />
            <Bar dataKey="outputPrice" fill="#10B981" name="Output Price" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}