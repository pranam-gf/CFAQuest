import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { GlobalFilters, filterByProvider, filterByContextLength } from "@/components/global-filters";
import { CommonFilters } from "@/components/common-filters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Check, X } from "lucide-react";
import { EssayEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";
import { ProviderLogo } from "@/components/provider-logo";
import { MedalIcon } from "@/components/medal-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { formatContextLength, getContextLengthColor } from "@/lib/context-length-utils";
import { StrategyBadge } from "@/components/strategy-badge";
import { LeaderboardTable, ColumnDefinition } from "@/components/leaderboard-table";
import { getDisplayName } from "@/lib/model-display-names";

const strategyDisplayNames: Record<string, string> = {
  "Default": "Zero-Shot",
  "Self-Consistency_N3": "SC-CoT N=3",
  "Self-Consistency_N5": "SC-CoT N=5",
  "Self-Discover": "Self-Discover",
};

const strategyDescriptions: Record<string, string> = {
  "Default": "The model generates a response in a single pass, without any complex prompting techniques.",
  "Self-Consistency_N3": "Self-Consistency with Chain-of-Thought, sampling 3 reasoning paths.",
  "Self-Consistency_N5": "Self-Consistency with Chain-of-Thought, sampling 5 reasoning paths.",
  "Self-Discover": "The model autonomously discovers reasoning structures to solve complex problems.",
};

interface EssayLeaderboardProps {
  viewFilter?: string;
  onViewFilterChange?: (view: string) => void;
}

export function EssayLeaderboard({ viewFilter = "essay", onViewFilterChange }: EssayLeaderboardProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState<string[]>(["all"]);
  const [contextLengthFilter, setContextLengthFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof EssayEvaluation>("avgRougeLF1");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'provider', 'model', 'avgSelfGrade', 'avgCosineSimilarity', 'avgRougeLF1', 'cosinePerDollar', 'reasoning', 'contextLength', 'strategyShort'
  ]);

  const { data: essayData = [], isLoading } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const handleSort = (key: keyof EssayEvaluation) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  let filteredData = filterData(essayData, {
    ...(modelTypeFilter && modelTypeFilter !== "all" && { modelType: modelTypeFilter }),
    ...(strategyFilter && strategyFilter !== "all" && { strategyShort: strategyFilter }),
  });
  filteredData = filterByProvider(filteredData, providerFilter);
  filteredData = filterByContextLength(filteredData, contextLengthFilter);

  const searchedData = searchData(filteredData, searchTerm, ["model", "strategyShort"]);
  const sortedData = sortData(searchedData, sortKey, sortDirection);

  // Available columns for the column selector - memoized to prevent re-renders
  const availableColumns = useMemo(() => [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'avgSelfGrade', label: 'Self Grade' },
    { key: 'avgCosineSimilarity', label: 'Cosine Similarity' },
    { key: 'avgRougeLF1', label: 'ROUGE-L F1' },
    { key: 'cosinePerDollar', label: 'Cost Efficiency' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'contextLength', label: 'Context' },
    { key: 'strategyShort', label: 'Strategy' },
  ], []);

  // Strategy options - memoized to prevent re-renders
  const strategyOptions = useMemo(() => [
    { value: "all", label: "All" },
    { value: "Default", label: "Zero-Shot" },
    { value: "Self-Consistency_N3", label: "SC-CoT N=3" },
    { value: "Self-Consistency_N5", label: "SC-CoT N=5" },
    { value: "Self-Discover", label: "Self-Discover" }
  ], []);

  const columns: ColumnDefinition<EssayEvaluation>[] = useMemo(() => [
    {
      key: 'provider',
      label: 'Provider',
      type: 'provider-tooltip',
      getValue: (row) => row.model
    },
    {
      key: 'model',
      label: 'Model',
      type: 'model',
      sortable: true
    },
    {
      key: 'avgSelfGrade',
      label: 'Self Grade',
      type: 'progress-bar',
      maxValue: 4,
      sortable: true,
      tooltip: 'Self Grade Information',
      tooltipContent: {
        'Self Grade': 'Graded by GPT-4.1 based on the CFA Level 3 rubric'
      }
    },
    {
      key: 'avgCosineSimilarity',
      label: 'Cosine Similarity',
      type: 'number',
      sortable: true,
      className: 'text-center'
    },
    {
      key: 'avgRougeLF1',
      label: 'ROUGE-L F1',
      type: 'number',
      sortable: true,
      className: 'text-center'
    },
    {
      key: 'cosinePerDollar',
      label: 'Cost Efficiency',
      type: 'number',
      sortable: true,
      className: 'text-center',
      render: (value) => (
        <div className="text-sm text-success dark:text-green-400 font-medium">
          {value}
        </div>
      )
    },
    {
      key: 'reasoning',
      label: 'Reasoning',
      type: 'reasoning',
      width: 'w-36',
      className: 'text-center'
    },
    {
      key: 'contextLength',
      label: 'Context',
      type: 'context',
      sortable: true
    },
    {
      key: 'strategyShort',
      label: 'Strategy',
      type: 'strategy',
      tooltip: 'Strategy Information',
      tooltipContent: Object.fromEntries(
        Object.entries(strategyDescriptions).map(([key, value]) => [
          strategyDisplayNames[key] || key,
          value
        ])
      )
    }
  ], []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <span className="text-xs text-slate-500 dark:text-gray-400">
          Last updated: September 12th, 2025
        </span>
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
        isMultiSelectStrategy={false}
        viewFilter={viewFilter}
        onViewFilterChange={onViewFilterChange}
      />
      
      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-visible">
        <LeaderboardTable
          data={sortedData}
          columns={columns}
          isLoading={isLoading}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          visibleColumns={visibleColumns}
          lastUpdated="July 31st, 2025"
        />
      </div>
    </div>
  );
}
