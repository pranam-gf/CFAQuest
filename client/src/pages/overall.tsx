import { useState, createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { calculateOverallScores, filterData, searchData } from "@/lib/data-processing";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { GlobalFilters, filterByProvider, filterByContextLength } from "@/components/global-filters";
import { CommonFilters } from "@/components/common-filters";
import { Check, X } from "lucide-react";
import { formatContextLength, getContextLengthColor } from "@/lib/context-length-utils";
import { getDisplayName } from "@/lib/model-display-names";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { McqLeaderboard } from "@/components/mcq-leaderboard";
import { EssayLeaderboard } from "@/components/essay-leaderboard";
import { LeaderboardTable, ColumnDefinition } from "@/components/leaderboard-table";

const strategyDisplayNames: Record<string, string> = {
  "Default (Single Pass)": "Zero-Shot",
  "Self-Consistency CoT (N=3 samples)": "SC-CoT N=3",
  "Self-Consistency CoT (N=5 samples)": "SC-CoT N=5",
  "Self-Discover": "Self-Discover",
  "Default": "Zero-Shot", // For essay data
  "Self-Consistency_N3": "SC-CoT N=3", // For essay data
  "Self-Consistency_N5": "SC-CoT N=5", // For essay data
};

const strategyDescriptions: Record<string, string> = {
  "Default (Single Pass)": "The model generates a response in a single pass, without any complex prompting techniques.",
  "Self-Consistency CoT (N=3 samples)": "Self-Consistency with Chain-of-Thought, sampling 3 reasoning paths.",
  "Self-Consistency CoT (N=5 samples)": "Self-Consistency with Chain-of-Thought, sampling 5 reasoning paths.",
  "Self-Discover": "The model autonomously discovers reasoning structures to solve complex problems.",
  "Default": "The model generates a response in a single pass, without any complex prompting techniques.",
  "Self-Consistency_N3": "Self-Consistency with Chain-of-Thought, sampling 3 reasoning paths.",
  "Self-Consistency_N5": "Self-Consistency with Chain-of-Thought, sampling 5 reasoning paths.",
};

type ViewType = 'overall' | 'mcq' | 'essay';

const ViewContext = createContext<{
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}>({ currentView: 'overall', setCurrentView: () => {} });

export const useView = () => useContext(ViewContext);

function OverallContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState<string[]>(["all"]);
  const [providerFilter, setProviderFilter] = useState<string[]>(["all"]);
  const [contextLengthFilter, setContextLengthFilter] = useState<string[]>(["all"]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'provider', 'model', 'overallScore', 'mcqScore', 'essayScore', 'reasoning', 'context'
  ]);

  const { data: mcqData = [], isLoading: isLoadingMcq } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [], isLoading: isLoadingEssay } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const isLoading = isLoadingMcq || isLoadingEssay;

  // Filter MCQ data
  let filteredMcqData = mcqData;
  
  // Apply model type filter
  if (modelTypeFilter && modelTypeFilter !== "all") {
    filteredMcqData = filteredMcqData.filter(item => item.modelType === modelTypeFilter);
  }
  
  // Apply strategy filter (multi-select)
  if (!strategyFilter.includes("all") && strategyFilter.length > 0) {
    filteredMcqData = filteredMcqData.filter(item => strategyFilter.includes(item.strategy));
  }
  
  filteredMcqData = filterByProvider(filteredMcqData, providerFilter);
  filteredMcqData = filterByContextLength(filteredMcqData, contextLengthFilter);
  const searchedMcqData = searchData(filteredMcqData, searchTerm, ["model", "strategy"]);

  // Filter Essay data
  let filteredEssayData = essayData;
  
  // Apply strategy filter (multi-select) - map strategy names for essay data
  if (!strategyFilter.includes("all") && strategyFilter.length > 0) {
    const essayStrategyMap: Record<string, string> = {
      "Default (Single Pass)": "Default",
      "Self-Consistency CoT (N=3 samples)": "Self-Consistency_N3",
      "Self-Consistency CoT (N=5 samples)": "Self-Consistency_N5",
      "Self-Discover": "Self-Discover"
    };
    
    const mappedStrategies = strategyFilter.map(strategy => essayStrategyMap[strategy] || strategy);
    filteredEssayData = filteredEssayData.filter(item => mappedStrategies.includes(item.strategyShort));
  }
  
  filteredEssayData = filterByProvider(filteredEssayData, providerFilter);
  filteredEssayData = filterByContextLength(filteredEssayData, contextLengthFilter);
  const searchedEssayData = searchData(filteredEssayData, searchTerm, ["model", "strategyShort"]);

  const overallScores = calculateOverallScores(searchedMcqData, searchedEssayData);
  const sortedOverallScores = [...overallScores].sort((a, b) => b.overallScore - a.overallScore);

  // Available columns for the column selector - memoized to prevent re-renders
  const availableColumns = useMemo(() => [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'overallScore', label: 'Overall Score' },
    { key: 'mcqScore', label: 'MCQ Score' },
    { key: 'essayScore', label: 'Essay Score' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'context', label: 'Context' },
  ], []);

  // Strategy options - memoized to prevent re-renders
  const strategyOptions = useMemo(() => [
    { value: "all", label: "All" },
    { value: "Default (Single Pass)", label: "Zero-Shot" },
    { value: "Self-Consistency CoT (N=3 samples)", label: "SC-CoT N=3" },
    { value: "Self-Consistency CoT (N=5 samples)", label: "SC-CoT N=5" },
    { value: "Self-Discover", label: "Self-Discover" }
  ], []);

  // Column definitions for different tables - memoized to prevent re-renders
  const overallColumns: ColumnDefinition[] = useMemo(() => [
    {
      key: 'provider',
      label: 'Provider',
      type: 'provider-tooltip',
      getValue: (row: any) => row.model
    },
    {
      key: 'model',
      label: 'Model',
      type: 'model'
    },
    {
      key: 'overallScore',
      label: 'Overall Score',
      type: 'custom',
      className: 'text-center',
      render: (value: any) => (
        <div className="text-sm text-gray-900 dark:text-white font-medium text-center">
          {value.toFixed(2)}
        </div>
      )
    },
    {
      key: 'mcqScore',
      label: 'MCQ Score',
      type: 'custom',
      render: (value: any, row: any) => {
        const mcqMatch = searchedMcqData.find(m => m.model === row.model);
        if (!mcqMatch) {
          return (
            <div className="text-sm text-gray-900 dark:text-white">
              N/A
            </div>
          );
        }
        const percentage = mcqMatch.accuracy * 100;
        return (
          <div className="flex items-center">
            <div className="flex-1 bg-white/20 dark:bg-white/10 rounded-full h-2 mr-3">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        );
      }
    },
    {
      key: 'essayScore',
      label: 'Essay Score',
      type: 'custom',
      render: (value: any, row: any) => {
        const essayMatch = searchedEssayData.find(m => m.model === row.model);
        if (!essayMatch) {
          return (
            <div className="text-sm text-gray-900 dark:text-white">
              N/A
            </div>
          );
        }
        const percentage = (essayMatch.avgSelfGrade / 4) * 100;
        return (
          <div className="flex items-center">
            <div className="flex-1 bg-white/20 dark:bg-white/10 rounded-full h-2 mr-3">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {essayMatch.avgSelfGrade}
            </span>
          </div>
        );
      }
    },
    {
      key: 'reasoning',
      label: 'Reasoning',
      type: 'custom',
      width: 'w-36',
      className: 'text-center',
      render: (value: any, row: any) => {
        const mcqMatch = searchedMcqData.find(m => m.model === row.model);
        const essayMatch = searchedEssayData.find(m => m.model === row.model);
        return (
          <div className="flex items-center justify-center">
            {(mcqMatch?.modelType === "Reasoning" || essayMatch?.modelType === "Reasoning") ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        );
      }
    },
    {
      key: 'context',
      label: 'Context',
      type: 'custom',
      render: (value: any, row: any) => {
        const mcqMatch = searchedMcqData.find(m => m.model === row.model);
        const essayMatch = searchedEssayData.find(m => m.model === row.model);
        const contextLength = mcqMatch?.contextLength || essayMatch?.contextLength || 0;
        return (
          <span className={`text-sm font-medium ${getContextLengthColor(contextLength)}`}>
            {formatContextLength(contextLength)}
          </span>
        );
      }
    }
  ], [searchedMcqData, searchedEssayData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <HeaderNavigation />
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CommonFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        modelTypeFilter={modelTypeFilter}
        onModelTypeFilterChange={setModelTypeFilter}
        strategyFilter={strategyFilter}
        onStrategyFilterChange={setStrategyFilter}
        providerFilter={providerFilter}
        onProviderFilterChange={setProviderFilter}
        contextLengthFilter={contextLengthFilter}
        onContextLengthFilterChange={setContextLengthFilter}
        availableColumns={availableColumns}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={setVisibleColumns}
        strategyOptions={strategyOptions}
        isMultiSelectStrategy={true}
      />

      <div className="mb-6">
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/30 dark:border-white/20 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Last updated: July 31st, 2025
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-visible">
          <LeaderboardTable
            data={sortedOverallScores}
            columns={overallColumns}
            isLoading={isLoading}
            visibleColumns={visibleColumns}
          />
        </div>
      </div>
    </div>
  );
}

export default function Overall() {
  const [currentView, setCurrentView] = useState<ViewType>('overall');

  const renderContent = () => {
    switch (currentView) {
      case 'mcq':
        return (
          <div className="w-full px-6 lg:px-8 pt-8 pb-0 flex-grow overflow-visible">
            <div className="max-w-7xl mx-auto overflow-visible">
              <McqLeaderboard />
            </div>
          </div>
        );
      case 'essay':
        return (
          <div className="w-full px-6 lg:px-8 pt-8 pb-0 flex-grow overflow-visible">
            <div className="max-w-7xl mx-auto overflow-visible">
              <EssayLeaderboard />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full px-6 lg:px-8 pt-8 pb-0 flex-grow overflow-visible">
            <div className="max-w-7xl mx-auto overflow-visible">
              <OverallContent />
            </div>
          </div>
        );
    }
  };

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      <div className="min-h-screen overflow-x-hidden overflow-y-visible bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
        <HeaderNavigation />
        <div className="flex-grow relative overflow-visible">
          <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-[#464348]/10 dark:via-blue-500/10 dark:to-[#464348]/20"></div>
          <div className="relative z-10 overflow-visible">
            <HeroSection />
            {renderContent()}
          </div>
        </div>
        <Footer />
      </div>
    </ViewContext.Provider>
  );
}
