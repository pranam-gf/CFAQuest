import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { EssayEvaluation } from "@/types/models";
import { sortData, searchData, filterData } from "@/lib/data-processing";

export function EssayLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof EssayEvaluation>("avgSelfGrade");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const filteredData = filterData(essayData, {
    ...(strategyFilter && strategyFilter !== "all" && { strategyShort: strategyFilter }),
  });

  const searchedData = searchData(filteredData, searchTerm, ["model", "strategyShort"]);
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

  const getStrategyBadgeVariant = (strategy: string) => {
    if (strategy.includes("Self-Consistency")) return "default";
    if (strategy.includes("Self-Discover")) return "secondary";
    return "outline";
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
        <CardTitle>Essay Evaluation Leaderboard</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={strategyFilter} onValueChange={setStrategyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Strategies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Strategies</SelectItem>
              <SelectItem value="Default">Default</SelectItem>
              <SelectItem value="Self-Consistency_N3">Self-Consistency N3</SelectItem>
              <SelectItem value="Self-Consistency_N5">Self-Consistency N5</SelectItem>
              <SelectItem value="Self-Discover">Self-Discover</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-64"
          />
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
                  <Button variant="ghost" onClick={() => handleSort("avgSelfGrade")} className="h-auto p-0">
                    Self Grade <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("avgCosineSimilarity")} className="h-auto p-0">
                    Cosine Similarity <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("avgRougeLF1")} className="h-auto p-0">
                    ROUGE-L F1 <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("cosinePerDollar")} className="h-auto p-0">
                    Cost Efficiency <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((model, index) => (
                <TableRow key={model.id} className="hover:bg-slate-50">
                  <TableCell>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-600"
                    }`}>
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getModelColor(model.model)} rounded-lg flex items-center justify-center mr-3`}>
                        <span className="text-white text-xs font-bold">{getModelInitial(model.model)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{model.model}</div>
                        <div className="text-sm text-slate-500">{model.strategyShort}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 mr-3 w-16">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${(model.avgSelfGrade / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {model.avgSelfGrade.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-900">
                    {model.avgCosineSimilarity.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900">
                    {model.avgRougeLF1.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-sm text-success font-medium">
                    {model.cosinePerDollar.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStrategyBadgeVariant(model.strategyShort)}>
                      {model.strategyShort}
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
