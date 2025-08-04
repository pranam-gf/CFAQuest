import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { GlobalFilters, filterByProvider, filterByContextLength } from "@/components/global-filters";
import { CommonFilters } from "@/components/common-filters";
import { McqEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";
import { LeaderboardTable, ColumnDefinition } from "@/components/leaderboard-table";
import { getDisplayName } from "@/lib/model-display-names";

const strategyDisplayNames: Record<string, string> = {
  "Default (Single Pass)": "Zero-Shot",
  "Self-Consistency CoT (N=3 samples)": "SC-CoT N=3",
  "Self-Consistency CoT (N=5 samples)": "SC-CoT N=5",
  "Self-Discover": "Self-Discover",
};

const strategyDescriptions: Record<string, string> = {
  "Default (Single Pass)": "The model generates a response in a single pass, without any complex prompting techniques.",
  "Self-Consistency CoT (N=3 samples)": "Self-Consistency with Chain-of-Thought, sampling 3 reasoning paths.",
  "Self-Consistency CoT (N=5 samples)": "Self-Consistency with Chain-of-Thought, sampling 5 reasoning paths.",
  "Self-Discover": "The model autonomously discovers reasoning structures to solve complex problems.",
};

export function McqLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState<string[]>(["all"]);
  const [contextLengthFilter, setContextLengthFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof McqEvaluation>("accuracy");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'provider', 'model', 'accuracy', 'avgTimePerQuestion', 'totalCost', 'reasoning', 'contextLength', 'strategy'
  ]);

  const { data: mcqData = [], isLoading } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const handleSort = (key: keyof McqEvaluation) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  let filteredData = filterData(mcqData, {
    ...(modelTypeFilter && modelTypeFilter !== "all" && { modelType: modelTypeFilter }),
    ...(strategyFilter && strategyFilter !== "all" && { strategy: strategyFilter }),
  });
  filteredData = filterByProvider(filteredData, providerFilter);
  filteredData = filterByContextLength(filteredData, contextLengthFilter);

  const searchedData = searchData(filteredData, searchTerm, ["model", "strategy"]);
  const sortedData = sortData(searchedData, sortKey, sortDirection);

  // Available columns for the column selector - memoized to prevent re-renders
  const availableColumns = useMemo(() => [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'avgTimePerQuestion', label: 'Avg Time (s)' },
    { key: 'totalCost', label: 'Total Cost ($)' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'contextLength', label: 'Context' },
    { key: 'strategy', label: 'Strategy' },
  ], []);

  // Strategy options - memoized to prevent re-renders
  const strategyOptions = useMemo(() => [
    { value: "all", label: "All" },
    { value: "Default (Single Pass)", label: "Zero-Shot" },
    { value: "Self-Consistency CoT (N=3 samples)", label: "SC-CoT N=3" },
    { value: "Self-Consistency CoT (N=5 samples)", label: "SC-CoT N=5" },
    { value: "Self-Discover", label: "Self-Discover" }
  ], []);

  const columns: ColumnDefinition<McqEvaluation>[] = useMemo(() => [
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
      key: 'accuracy',
      label: 'Accuracy',
      type: 'accuracy',
      sortable: true
    },
    {
      key: 'avgTimePerQuestion',
      label: 'Avg Time (s)',
      type: 'number',
      sortable: true
    },
    {
      key: 'totalCost',
      label: 'Total Cost ($)',
      type: 'number',
      sortable: true
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
      key: 'strategy',
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
        isMultiSelectStrategy={false}
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

      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-visible">
        <LeaderboardTable
          data={sortedData}
          columns={columns}
          isLoading={isLoading}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          visibleColumns={visibleColumns}
        />
      </div>
    </div>
  );
}
