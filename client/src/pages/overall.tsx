import { useState, createContext, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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

interface OverallContentProps {
  viewFilter?: string;
  onViewFilterChange?: (view: string) => void;
}

function OverallContent({ viewFilter = "overall", onViewFilterChange }: OverallContentProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState<string[]>([]);
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [contextLengthFilter, setContextLengthFilter] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("overallScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
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
  
  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  // Sort the data based on current sort settings
  const sortedOverallScores = [...overallScores].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortKey) {
      case 'model':
        aValue = a.model.toLowerCase();
        bValue = b.model.toLowerCase();
        break;
      case 'overallScore':
        aValue = a.overallScore;
        bValue = b.overallScore;
        break;
      case 'reasoning':
        const mcqMatchA = searchedMcqData.find(m => m.model === a.model);
        const essayMatchA = searchedEssayData.find(m => m.model === a.model);
        const mcqMatchB = searchedMcqData.find(m => m.model === b.model);
        const essayMatchB = searchedEssayData.find(m => m.model === b.model);
        // Convert reasoning to numeric: true (reasoning) = 1, false (non-reasoning) = 0
        aValue = (mcqMatchA?.modelType === "Reasoning" || essayMatchA?.modelType === "Reasoning") ? 1 : 0;
        bValue = (mcqMatchB?.modelType === "Reasoning" || essayMatchB?.modelType === "Reasoning") ? 1 : 0;
        break;
      case 'context':
        const contextA = searchedMcqData.find(m => m.model === a.model)?.contextLength || searchedEssayData.find(m => m.model === a.model)?.contextLength || 0;
        const contextB = searchedMcqData.find(m => m.model === b.model)?.contextLength || searchedEssayData.find(m => m.model === b.model)?.contextLength || 0;
        aValue = contextA;
        bValue = contextB;
        break;
      default:
        aValue = a.overallScore;
        bValue = b.overallScore;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    const comparison = (aValue as number) - (bValue as number);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Available columns for the column selector - memoized to prevent re-renders
  const availableColumns = useMemo(() => [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'overallScore', label: 'Overall' },
    { key: 'mcqScore', label: 'MCQ' },
    { key: 'essayScore', label: 'Essay' },
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
  const overallColumns: ColumnDefinition<any>[] = useMemo(() => [
    {
      key: 'provider',
      label: 'Provider',
      type: 'provider-tooltip',
      className: 'w-16 text-center',
      getValue: (row: any) => row.model
    },
    {
      key: 'model',
      label: 'Model',
      type: 'model',
      className: 'w-40',
      sortable: true
    },
    {
      key: 'overallScore',
      label: 'Overall',
      type: 'custom',
      className: 'text-center w-20',
      sortable: true,
      tooltip: 'Overall Score Formula',
      tooltipContent: {
        'Formula': '(Best MCQ Accuracy + Best Essay Self-Grade) / 2',
        'MCQ Score': 'Highest accuracy (0-1) across all strategies for each model',
        'Essay Score': 'Highest self-grade total across all strategies for each model',
        'Note': 'Essays use custom scales per question, no normalization applied'
      },
      render: (value: any) => (
        <span className="text-sm text-gray-900 dark:text-white font-medium">
          {value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'mcqScore',
      label: 'MCQ',
      type: 'custom',
      className: 'text-center w-24',
      render: (value: any, row: any) => {
        const mcqMatch = searchedMcqData.find(m => m.model === row.model);
        if (!mcqMatch) {
          return (
            <div className="text-sm text-gray-900 dark:text-white text-center">
              N/A
            </div>
          );
        }
        const percentage = mcqMatch.accuracy * 100;
        return (
          <div className="flex flex-col items-center gap-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(percentage)}%
            </span>
            <div className="w-full max-w-16 bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'essayScore',
      label: 'Essay',
      type: 'custom',
      className: 'text-center w-24',
      tooltip: 'Essay Score Explanation',
      tooltipContent: {
        'Rubric': 'Based on CFA Level 3 scoring rubric',
        'Evaluation': 'Self-Grade total from GPT-4.1 evaluation'
      },
      render: (value: any, row: any) => {
        const essayMatch = searchedEssayData.find(m => m.model === row.model);
        if (!essayMatch) {
          return (
            <div className="text-sm text-gray-900 dark:text-white text-center">
              N/A
            </div>
          );
        }
        // Just use the self-grade as is (no normalization or ROUGE-L)
        const selfGrade = essayMatch.avgSelfGrade;
        // For progress bar, assume max possible score is around 4 (typical essay scale)
        const percentage = Math.min((selfGrade / 4) * 100, 100);
        
        return (
          <div className="flex flex-col items-center gap-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {selfGrade.toFixed(2)}
            </span>
            <div className="w-full max-w-16 bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'reasoning',
      label: 'Reasoning',
      type: 'custom',
      className: 'text-center w-20',
      sortable: true,
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
      className: 'text-center w-20',
      sortable: true,
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
      <div className="min-h-screen bg-white dark:bg-black">
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
      <div className="mb-6">
        <div className="flex justify-end"> 
            <span className="text-xs text-slate-500 dark:text-gray-400 font-light">
          Last updated: September 12th, 2025
            </span>
        </div>
      </div>

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
        viewFilter={viewFilter}
        onViewFilterChange={onViewFilterChange}
      />

      <div className="mb-8">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-visible">
          <LeaderboardTable
            data={sortedOverallScores}
            columns={overallColumns}
            isLoading={isLoading}
            visibleColumns={visibleColumns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </div>
  );
}

export default function Overall() {
  const [currentView, setCurrentView] = useState<ViewType>('overall');

  const handleViewFilterChange = (view: string) => {
    setCurrentView(view as ViewType);
  };

  const renderContent = () => {
    let content;
    switch (currentView) {
      case 'mcq':
        content = <McqLeaderboard 
          viewFilter={currentView}
          onViewFilterChange={handleViewFilterChange}
        />;
        break;
      case 'essay':
        content = <EssayLeaderboard 
          viewFilter={currentView}
          onViewFilterChange={handleViewFilterChange}
        />;
        break;
      default:
        content = <OverallContent 
          viewFilter={currentView}
          onViewFilterChange={handleViewFilterChange}
        />;
        break;
    }

    return (
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-full px-6 lg:px-8 pt-8 pb-0 flex-grow overflow-visible">
          <div className="max-w-7xl mx-auto overflow-visible">
            {content}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      <div className="min-h-screen overflow-x-hidden overflow-y-visible bg-white dark:bg-black flex flex-col">
        <HeaderNavigation />
        <div className="flex-grow relative overflow-visible">
          {/* Floating glass elements */}
          <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-white/10 dark:to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
          <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
          
          <div className="relative z-10 overflow-visible">
            <HeroSection />
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </div>
    </ViewContext.Provider>
  );
}
