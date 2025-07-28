import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Target, PenTool, DollarSign, TrendingUp } from "lucide-react";
import { Statistics } from "@/types/models";

export function OverviewMetrics() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-slate-500">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Models</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.totalModels}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="text-primary w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active models
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Best MCQ Accuracy</p>
              <p className="text-2xl font-semibold text-slate-900">
                {(stats.bestMcqAccuracy * 100).toFixed(2)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Target className="text-success w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600">{stats.bestMcqModel}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Best Essay Score</p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.bestEssayScore.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <PenTool className="text-success w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600">{stats.bestEssayModel}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Most Cost Efficient</p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.mostCostEfficient.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-success w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600">{stats.mostCostEfficientModel}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
