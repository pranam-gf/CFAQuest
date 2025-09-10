import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, Area, AreaChart, Cell } from "recharts";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { motion } from 'framer-motion';
import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";
import { ChartTooltip, ScatterChartTooltip } from "@/components/chart-tooltip";
import { getModelPricing, getModelAveragePrice } from "@/lib/model-pricing";


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
      
      const avgPrice = getModelAveragePrice(modelName);
      if (!avgPrice) return null;
      
      return {
        model: getDisplayName(modelName),
        fullModel: modelName,
        provider,
        accuracy: mcqModel ? mcqModel.accuracy * 100 : 0,
        essayScore: essayModel ? essayModel.avgSelfGrade : 0,
        inputPrice: pricing.inputTokenPrice,
        outputPrice: pricing.outputTokenPrice,
        avgPrice: avgPrice,
        totalCost: mcqModel ? mcqModel.totalCost : essayModel ? essayModel.totalApiCost : 0,
        modelType: mcqModel?.modelType || essayModel?.modelType || 'Non-Reasoning'
      };
    })
    .filter(Boolean);

  // Price vs Performance scatter data
  const priceVsPerformance = uniqueModels.map(model => ({
    x: model!.avgPrice,
    y: model!.accuracy,
    model: model!.model, // Display name for tooltip
    fullModel: model!.fullModel, // Original model ID for logo lookup
    provider: model!.provider,
    totalCost: model!.totalCost,
    color: getProviderColor(model!.provider),
    modelType: model!.modelType
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

  const providerAvgData = Object.values(providerPricing).map((provider: any) => {
    // Find a representative model for this provider to get the logo
    const representativeModel = uniqueModels.find(model => model?.provider === provider.provider);
    return {
      provider: provider.provider,
      avgPrice: provider.totalPrice / provider.count,
      avgAccuracy: provider.accuracy / provider.count,
      color: getProviderColor(provider.provider),
      fullModel: representativeModel?.fullModel || provider.provider.toLowerCase() // fallback
    };
  });


  // MCQ Cost efficiency (performance per dollar)
  const mcqCostEfficiencyData = uniqueModels
    .map(model => ({
      model: model!.model,
      fullModel: model!.fullModel, // Add original model ID for logo lookup
      efficiency: model!.accuracy / model!.avgPrice, // accuracy per dollar
      accuracy: model!.accuracy,
      price: model!.avgPrice,
      provider: model!.provider,
      modelType: model!.modelType
    }))
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 12);

  // Essay Cost efficiency (performance per dollar)
  const essayCostEfficiencyData = uniqueModels
    .filter(model => model!.essayScore > 0) // Only include models with essay scores
    .map(model => ({
      model: model!.model,
      fullModel: model!.fullModel,
      efficiency: model!.essayScore / model!.avgPrice, // essay score per dollar
      essayScore: model!.essayScore,
      price: model!.avgPrice,
      provider: model!.provider,
      modelType: model!.modelType
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
          <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">
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
              type="number"
              dataKey="x" 
              name="Average Price" 
              unit="$" 
              domain={[0, 'dataMax']}
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
            <Tooltip content={<ScatterChartTooltip />} />
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
{/* Provider Average Pricing - moved below */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">
            Provider Average Pricing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Average cost per 1M tokens by organization
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={providerAvgData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              {providerAvgData.map((entry) => (
                <linearGradient key={entry.provider} id={`provider-gradient-${entry.provider}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                </linearGradient>
              ))}
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
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="avgPrice" radius={[4, 4, 0, 0]}>
              {providerAvgData.map((entry) => (
                <Cell key={entry.provider} fill={`url(#provider-gradient-${entry.provider})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two column layout for cost efficiency charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Essay Cost Efficiency Ranking */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">
              Essay Cost Efficiency
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Essay performance per dollar (self-grade / avg price)
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={essayCostEfficiencyData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="essayEfficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.4} />
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
              <Tooltip content={<ChartTooltip />} />
              <Bar 
                dataKey="efficiency" 
                fill="url(#essayEfficiencyGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* MCQ Cost Efficiency Ranking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">
              MCQ Cost Efficiency
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              MCQ performance per dollar (accuracy / avg price)
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mcqCostEfficiencyData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="mcqEfficiencyGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip content={<ChartTooltip />} />
              <Bar 
                dataKey="efficiency" 
                fill="url(#mcqEfficiencyGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      
    </div>
  );
}