import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { McqEvaluation, EssayEvaluation, PricingInfo } from "@/types/models";
import { Plus, ChevronDown, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/components/provider-logo";
import { ComparisonCharts } from "@/components/comparison-charts";
import { getDisplayName } from "@/lib/model-display-names";
import { getProviderInfo } from "@/lib/provider-mapping";

interface Model {
  id: string;
  name: string;
  provider: string;
  website?: string;
  contextLength?: number;
  pricing?: PricingInfo;
}

interface ModelSelectionDropdownProps {
  selectedModels: string[];
  onSelectModel: (modelId: string) => void;
  allModels: Model[];
}

function ModelSelectionDropdown({ selectedModels, onSelectModel, allModels }: ModelSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredModels = allModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Models to Compare
        <ChevronDown className={cn("w-5 h-5 ml-2 transition-transform", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -10, scale: 0.95, x: "-50%" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-96 left-1/2 origin-top rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-6 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/80 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
            <ScrollArea className="h-64">
              <div className="p-2 pt-0">
                {filteredModels.map(model => (
                  <div
                    key={model.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => onSelectModel(model.id)}
                  >
                    <Checkbox
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={() => onSelectModel(model.id)}
                    />
                    <div className="flex-grow flex items-center justify-between">
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{getDisplayName(model.name)}</span>
                        <ProviderLogo modelName={model.name} size="sm" showName />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModelCardProps {
    modelId: string;
    mcqData: McqEvaluation[] | undefined;
    essayData: EssayEvaluation[] | undefined;
    onRemove: (modelId: string) => void;
}

// Helper function to get model pricing information
function getModelPricing(modelId: string): PricingInfo | null {
  // Define pricing for common models (these are approximate prices as of 2024)
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

// Helper function to get model website
function getModelWebsite(modelId: string): string | null {
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
}

function ModelCard({ modelId, mcqData, essayData, onRemove }: ModelCardProps) {
  const modelMcq = mcqData?.find(m => m.model === modelId);
  const modelEssay = essayData?.find(e => e.model === modelId);
  const providerInfo = getProviderInfo(modelId);
  const pricing = getModelPricing(modelId);
  const website = getModelWebsite(modelId);
  const contextLength = modelMcq?.contextLength || modelEssay?.contextLength;

  if (!modelMcq && !modelEssay) {
    return (
      <div className="w-full max-w-md min-w-[320px] rounded-2xl border border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-xl shadow-2xl p-6 text-center">
        <h3 className="text-xl font-light text-gray-900 dark:text-white">{getDisplayName(modelId)}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md min-w-[320px] rounded-2xl border border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-xl shadow-2xl p-6 transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-xl font-light text-gray-900 dark:text-white truncate">{getDisplayName(modelId)}</h3>
          <div className="flex items-center gap-2 mt-1">
            <ProviderLogo modelName={modelId} size="sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{providerInfo.name}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8 rounded-full hover:bg-red-500 hover:text-white transition-colors" onClick={() => onRemove(modelId)}>
            <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Model Info Section */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        {contextLength && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Context Length:</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{contextLength.toLocaleString()} tokens</span>
          </div>
        )}
        
        {website && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Website:</span>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {website.replace('https://', '')}
            </a>
          </div>
        )}

        {pricing && (
          <div className="space-y-1">
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
      
      <div className="space-y-4">
        {modelMcq && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">MCQ Performance</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Accuracy:</span>
                <span className="font-medium text-gray-800 dark:text-white">{(modelMcq.accuracy * 100).toFixed(1)}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Avg. Time:</span>
                <span className="font-medium text-gray-800 dark:text-white">{modelMcq.avgTimePerQuestion.toFixed(1)}s</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Cost:</span>
                <span className="font-medium text-gray-800 dark:text-white">${modelMcq.totalCost.toFixed(4)}</span>
              </li>
            </ul>
          </div>
        )}

        {modelMcq && modelEssay && <div className="my-4 border-t border-gray-200 dark:border-gray-700" />} 

        {modelEssay && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">Essay Performance</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Self Grade:</span>
                <span className="font-medium text-gray-800 dark:text-white">{modelEssay.avgSelfGrade.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Cosine Similarity:</span>
                <span className="font-medium text-gray-800 dark:text-white">{modelEssay.avgCosineSimilarity.toFixed(3)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Cost:</span>
                <span className="font-medium text-gray-800 dark:text-white">${modelEssay.totalApiCost.toFixed(4)}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const { data: mcqData } = useQuery<McqEvaluation[]>({ queryKey: ["/api/mcq-evaluations"] });
  const { data: essayData } = useQuery<EssayEvaluation[]>({ queryKey: ["/api/essay-evaluations"] });

  const allModels = [...(mcqData || []), ...(essayData || [])];
  const uniqueModels = Array.from(new Set(allModels.map(m => m.model)))
    .map(modelName => {
      const modelData = allModels.find(m => m.model === modelName);
      const providerInfo = getProviderInfo(modelName);
      return {
        id: modelName,
        name: modelName,
        provider: providerInfo.name,
        website: getModelWebsite(modelName) || undefined,
        contextLength: modelData?.contextLength,
        pricing: getModelPricing(modelName) || undefined,
      };
    })
    .sort((a, b) => {
      // Sort by provider first, then by model name
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      return getDisplayName(a.name).localeCompare(getDisplayName(b.name));
    });

  const handleSelectModel = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleRemoveModel = (modelId: string) => {
    setSelectedModels(prev => prev.filter(id => id !== modelId));
  };

  const handleClearAll = () => {
    setSelectedModels([]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderNavigation />
      <main className="flex-grow p-4 pt-24 relative min-h-screen">
        <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
        {/* Floating glass elements */}
        <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-white/10 dark:to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
        <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
        <div className="relative z-10">
        <div className="container mx-auto pt-16 pb-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl font-light text-gray-900 dark:text-white mb-2 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
            >
              Model Comparison
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Select models to compare their performance side-by-side.
            </motion.p>
            <motion.div 
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ModelSelectionDropdown
                selectedModels={selectedModels}
                onSelectModel={handleSelectModel}
                allModels={uniqueModels}
              />
              {selectedModels.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    size="icon"
                    className="rounded-full border-red-200 dark:border-red-800 text-red-600 dark:text-white-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    title="Clear all selected models"
                  >
                    <X className="h-4 w-4 hover:text-white" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {selectedModels.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8 justify-items-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatePresence mode="popLayout">
                  {selectedModels.map((modelId, index) => (
                    <motion.div
                      key={modelId}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        type: "tween",
                        ease: "easeInOut"
                      }}
                      layout
                    >
                      <ModelCard 
                          key={modelId} 
                          modelId={modelId} 
                          mcqData={mcqData} 
                          essayData={essayData} 
                          onRemove={handleRemoveModel} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {selectedModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ComparisonCharts 
                  selectedModels={selectedModels} 
                  mcqData={mcqData} 
                  essayData={essayData} 
              />
            </motion.div>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
