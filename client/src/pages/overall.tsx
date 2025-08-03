import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { MedalIcon } from "@/components/medal-icon";
import { ProviderLogo } from "@/components/provider-logo";
import { calculateOverallScores, filterData, searchData } from "@/lib/data-processing";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/hero-section";

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

export default function Overall() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");

  const { data: mcqData = [], isLoading: isLoadingMcq } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [], isLoading: isLoadingEssay } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const isLoading = isLoadingMcq || isLoadingEssay;

  const filteredMcqData = filterData(mcqData, {
    ...(modelTypeFilter && modelTypeFilter !== "all" && { modelType: modelTypeFilter }),
    ...(strategyFilter && strategyFilter !== "all" && { strategy: strategyFilter }),
  });
  const searchedMcqData = searchData(filteredMcqData, searchTerm, ["model", "strategy"]);

  const filteredEssayData = filterData(essayData, {
    ...(strategyFilter && strategyFilter !== "all" && { strategyShort: strategyFilter }),
  });
  const searchedEssayData = searchData(filteredEssayData, searchTerm, ["model", "strategyShort"]);

  const overallScores = calculateOverallScores(searchedMcqData, searchedEssayData);

  const top10Mcq = [...searchedMcqData].sort((a, b) => b.accuracy - a.accuracy).slice(0, 10);
  const top10Essay = [...searchedEssayData].sort((a, b) => b.avgSelfGrade - a.avgSelfGrade).slice(0, 10);
  const top10Overall = [...overallScores].sort((a, b) => b.overallScore - a.overallScore).slice(0, 10);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <HeaderNavigation />
      <div className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto py-8">
          <div className="mt-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Overall Leaderboard</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-semibold">Top 10 Overall Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Rank</TableHead>
                <TableHead className="font-medium">Model</TableHead>
                <TableHead className="font-medium">Overall Score</TableHead>
                <TableHead className="font-medium">Provider</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top10Overall.map((model, index) => (
                <TableRow key={model.model} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-light">
                    <div className="flex items-center justify-center">
                      <MedalIcon rank={index + 1} />
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{model.model}</div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {model.overallScore.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <ProviderLogo modelName={model.model} showName />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold">Top 10 MCQ Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Rank</TableHead>
                    <TableHead className="font-medium">Model</TableHead>
                    <TableHead className="font-medium">Accuracy</TableHead>
                    <TableHead className="font-medium">Provider</TableHead>
                    <TableHead className="font-medium">
                      <div className="flex items-center">
                        Strategy
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
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
                  {top10Mcq.map((model, index) => (
                    <TableRow key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-light">
                        <div className="flex items-center justify-center">
                          <MedalIcon rank={index + 1} />
                        </div>
                      </TableCell>
                      <TableCell className="font-light">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{model.model}</div>
                      </TableCell>
                      <TableCell className="font-light">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {(model.accuracy * 100).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="font-light">
                        <ProviderLogo modelName={model.model} showName />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-semibold">Top 10 Essay Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Rank</TableHead>
                    <TableHead className="font-medium">Model</TableHead>
                    <TableHead className="font-medium">Self Grade</TableHead>
                    <TableHead className="font-medium">Provider</TableHead>
                    <TableHead className="font-medium">
                      <div className="flex items-center">
                        Strategy
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
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
                  {top10Essay.map((model, index) => (
                    <TableRow key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-light">
                        <div className="flex items-center justify-center">
                          <MedalIcon rank={index + 1} />
                        </div>
                      </TableCell>
                      <TableCell className="font-light">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{model.model}</div>
                      </TableCell>
                      <TableCell className="font-light">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {model.avgSelfGrade.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="font-light">
                        <ProviderLogo modelName={model.model} showName />
                      </TableCell>
                      <TableCell className="font-light">
                        <Badge variant="outline">
                          {strategyDisplayNames[model.strategyShort] || model.strategyShort}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
