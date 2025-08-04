import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { GlobalFilters, filterByProvider, filterByContextLength } from "@/components/global-filters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Check, X } from "lucide-react";
import { EssayEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";
import { Search, Target, Cpu } from "lucide-react";
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

export function EssayLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [contextLengthFilter, setContextLengthFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof EssayEvaluation>("avgSelfGrade");
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

  // Available columns for the column selector
  const availableColumns = [
    { key: 'provider', label: 'Provider' },
    { key: 'model', label: 'Model' },
    { key: 'avgSelfGrade', label: 'Self Grade' },
    { key: 'avgCosineSimilarity', label: 'Cosine Similarity' },
    { key: 'avgRougeLF1', label: 'ROUGE-L F1' },
    { key: 'cosinePerDollar', label: 'Cost Efficiency' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'contextLength', label: 'Context' },
    { key: 'strategyShort', label: 'Strategy' },
  ];

  const columns: ColumnDefinition<EssayEvaluation>[] = [
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
  ];

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
                  { value: "Default", label: "Zero-Shot" },
                  { value: "Self-Consistency_N3", label: "SC-CoT N=3" },
                  { value: "Self-Consistency_N5", label: "SC-CoT N=5" },
                  { value: "Self-Discover", label: "Self-Discover" }
                ]}
              />
            </>
          }
        />
      </div>
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
  );
}
