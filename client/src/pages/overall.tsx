import { useState, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { calculateOverallScores, filterData, searchData } from "@/lib/data-processing";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { GlobalFilters, filterByProvider, filterByContextLength } from "@/components/global-filters";
import { Check, X, Search, Cpu, Target } from "lucide-react";
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
  const [strategyFilter, setStrategyFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [contextLengthFilter, setContextLengthFilter] = useState("");
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

  let filteredMcqData = filterData(mcqData, {
    ...(modelTypeFilter && modelTypeFilter !== "all" && { modelType: modelTypeFilter }),
    ...(strategyFilter && strategyFilter !== "all" && { strategy: strategyFilter }),
  });
  filteredMcqData = filterByProvider(filteredMcqData, providerFilter);
  filteredMcqData = filterByContextLength(filteredMcqData, contextLengthFilter);
  const searchedMcqData = searchData(filteredMcqData, searchTerm, ["model", "strategy"]);

  let filteredEssayData = filterData(essayData, {
    ...(strategyFilter && strategyFilter !== "all" && { strategyShort: strategyFilter }),
  });
  filteredEssayData = filterByProvider(filteredEssayData, providerFilter);
  filteredEssayData = filterByContextLength(filteredEssayData, contextLengthFilter);
  const searchedEssayData = searchData(filteredEssayData, searchTerm, ["model", "strategyShort"]);

  const overallScores = calculateOverallScores(searchedMcqData, searchedEssayData);
  const sortedOverallScores = [...overallScores].sort((a, b) => b.overallScore - a.overallScore);

  // Available columns for the column selector
  const availableColumns = [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'overallScore', label: 'Overall Score' },
    { key: 'mcqScore', label: 'MCQ Score' },
    { key: 'essayScore', label: 'Essay Score' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'context', label: 'Context' },
  ];

  // Column definitions for different tables
  const overallColumns: ColumnDefinition[] = [
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
      render: (value: any) => (
        <div className="text-sm text-gray-900 dark:text-white font-medium">
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
  ];

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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative max-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 backdrop-blur-md shadow-sm"
          />
        </div>
        <GlobalFilters
          providerFilter={providerFilter}
          onProviderFilterChange={setProviderFilter}
          contextLengthFilter={contextLengthFilter}
          onContextLengthFilterChange={setContextLengthFilter}
          availableColumns={availableColumns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={setVisibleColumns}
          additionalFilters={
            <>
              <DropdownMenu
                value={modelTypeFilter}
                onValueChange={setModelTypeFilter}
                placeholder="Models"
                icon={<Cpu className="h-4 w-4" />}
                dynamicWidth
                options={[
                  { value: "all", label: "All" },
                  { value: "Reasoning", label: "Reasoning" },
                  { value: "Non-Reasoning", label: "Non-Reasoning" }
                ]}
              />
              <DropdownMenu
                value={strategyFilter}
                onValueChange={setStrategyFilter}
                placeholder="Strategy"
                icon={<Target className="h-4 w-4" />}
                dynamicWidth
                minWidth={140}
                options={[
                  { value: "all", label: "All" },
                  { value: "Default (Single Pass)", label: "Zero-Shot" },
                  { value: "Self-Consistency CoT (N=3 samples)", label: "SC-CoT N=3" },
                  { value: "Self-Consistency CoT (N=5 samples)", label: "SC-CoT N=5" },
                  { value: "Self-Discover", label: "Self-Discover" }
                ]}
              />
            </>
          }
        />
      </div>

      <div className="mb-8">
        <LeaderboardTable
          data={sortedOverallScores}
          columns={overallColumns}
          isLoading={isLoading}
          visibleColumns={visibleColumns}
        />
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
          <div className="w-full px-6 lg:px-8 py-8 flex-grow">
            <div className="max-w-7xl mx-auto">
              <McqLeaderboard />
            </div>
          </div>
        );
      case 'essay':
        return (
          <div className="w-full px-6 lg:px-8 py-8 flex-grow">
            <div className="max-w-7xl mx-auto">
              <EssayLeaderboard />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full px-6 lg:px-8 py-8 flex-grow">
            <div className="max-w-7xl mx-auto">
              <OverallContent />
            </div>
          </div>
        );
    }
  };

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <HeaderNavigation />
        <div className="flex-grow relative">
          <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-[#464348]/10 dark:via-blue-500/10 dark:to-[#464348]/20"></div>
          <div className="relative z-10">
            <HeroSection />
            {renderContent()}
          </div>
        </div>
        <Footer />
      </div>
    </ViewContext.Provider>
  );
}
