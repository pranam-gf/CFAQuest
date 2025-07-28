import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Scale, Filter, ArrowUpDown } from "lucide-react";
import { McqEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";

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

  const getModelInitial = (model: string) => {
    return model.charAt(0).toUpperCase();
  };

  const getModelColor = (model: string) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-blue-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-teal-500 to-green-600",
    ];
    const index = model.length % colors.length;
    return colors[index];
  };

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
        <CardTitle>MCQ Performance Leaderboard</CardTitle>
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
              <SelectItem value="Default (Single Pass)">Default</SelectItem>
              <SelectItem value="Self-Consistency CoT (N=3 samples)">Self-Consistency N3</SelectItem>
              <SelectItem value="Self-Consistency CoT (N=5 samples)">Self-Consistency N5</SelectItem>
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
                <TableHead>Rank</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("model")} className="h-auto p-0">
                    Model <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("accuracy")} className="h-auto p-0">
                    Accuracy <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("avgTimePerQuestion")} className="h-auto p-0">
                    Avg Time (s) <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("totalCost")} className="h-auto p-0">
                    Total Cost ($) <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Model Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((model, index) => (
                <TableRow key={model.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                        index === 0 ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getModelColor(model.model)} rounded-lg flex items-center justify-center mr-3`}>
                        <span className="text-white text-xs font-bold">{getModelInitial(model.model)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{model.model}</div>
                        <div className="text-sm text-slate-500">{model.strategy}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  <TableCell className="text-sm text-slate-900">
                    {model.avgTimePerQuestion.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900">
                    ${model.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={model.modelType === "Reasoning" ? "default" : "secondary"}>
                      {model.modelType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Scale className="w-4 h-4" />
                      </Button>
                    </div>
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
