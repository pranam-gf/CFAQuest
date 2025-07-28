import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { McqEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";
import { ProviderLogo } from "@/components/provider-logo";
import { MedalIcon } from "@/components/medal-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
  const [sortKey, setSortKey] = useState<keyof McqEvaluation>("accuracy");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const filteredData = filterData(mcqData, {
    ...(modelTypeFilter && modelTypeFilter !== "all" && { modelType: modelTypeFilter }),
    ...(strategyFilter && strategyFilter !== "all" && { strategy: strategyFilter }),
  });

  const searchedData = searchData(filteredData, searchTerm, ["model", "strategy"]);
  const sortedData = sortData(searchedData, sortKey, sortDirection);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">MCQ Performance Leaderboard</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-64"
          />
          <Select value={modelTypeFilter} onValueChange={setModelTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Model Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Model Types</SelectItem>
              <SelectItem value="Reasoning">Reasoning</SelectItem>
              <SelectItem value="Non-Reasoning">Non-Reasoning</SelectItem>
            </SelectContent>
          </Select>
          <Select value={strategyFilter} onValueChange={setStrategyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Strategies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Strategies</SelectItem>
              <SelectItem value="Default (Single Pass)">Zero-Shot</SelectItem>
              <SelectItem value="Self-Consistency CoT (N=3 samples)">SC-CoT N=3</SelectItem>
              <SelectItem value="Self-Consistency CoT (N=5 samples)">SC-CoT N=5</SelectItem>
              <SelectItem value="Self-Discover">Self-Discover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Rank</TableHead>
                <TableHead className="font-medium">
                  <Button variant="ghost" onClick={() => handleSort("model")} className="h-auto p-0 font-medium">
                    Model <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium">
                  <Button variant="ghost" onClick={() => handleSort("accuracy")} className="h-auto p-0 font-medium">
                    Accuracy <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium">
                  <Button variant="ghost" onClick={() => handleSort("avgTimePerQuestion")} className="h-auto p-0 font-medium">
                    Avg Time (s) <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium">
                  <Button variant="ghost" onClick={() => handleSort("totalCost")} className="h-auto p-0 font-medium">
                    Total Cost ($) <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium">Provider</TableHead>
                <TableHead className="w-36 font-medium">Model Type</TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center">
                    Strategy
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 w-4 h-4 text-slate-500 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {Object.entries(strategyDescriptions).map(([key, value]) => (
                            <p key={key}><strong>{strategyDisplayNames[key] || key}:</strong> {value}</p>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((model, index) => (
                <TableRow key={model.id} className="hover:bg-slate-50">
                  <TableCell className="font-light">
                    <div className="flex items-center justify-center">
                      <MedalIcon rank={index + 1} />
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="text-sm font-medium text-slate-900">{model.model}</div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${model.accuracy * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {(model.accuracy * 100).toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-900 font-light">
                    {model.avgTimePerQuestion.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900 font-light">
                    ${model.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-light">
                    <ProviderLogo modelName={model.model} showName />
                  </TableCell>
                  <TableCell className="font-light">
                    <Badge variant={model.modelType === "Reasoning" ? "default" : "secondary"}>
                      {model.modelType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-light">
                    <Badge variant="outline">
                      {strategyDisplayNames[model.strategy] || model.strategy}
                    </Badge>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
