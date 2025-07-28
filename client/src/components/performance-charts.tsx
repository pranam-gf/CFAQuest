import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";
import { McqEvaluation, EssayEvaluation } from "@/types/models";
import { processChartData } from "@/lib/data-processing";

export function PerformanceCharts() {
  const { data: mcqData = [] } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [] } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  const chartData = processChartData(mcqData, essayData);

  const modelTypeData = [
    { name: "Reasoning Models", accuracy: chartData.modelTypeAccuracy.reasoning },
    { name: "Non-Reasoning Models", accuracy: chartData.modelTypeAccuracy.nonReasoning },
  ];

  const pieData = [
    { name: "High Performance (70%+)", value: chartData.performanceDistribution.high, color: "#10B981" },
    { name: "Medium Performance (50-70%)", value: chartData.performanceDistribution.medium, color: "#F59E0B" },
    { name: "Low Performance (<50%)", value: chartData.performanceDistribution.low, color: "#EF4444" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>MCQ Accuracy by Model Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={modelTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Accuracy"]} />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost vs Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={chartData.costPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Cost" unit="$" />
              <YAxis dataKey="y" name="Accuracy" unit="%" domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => [
                  name === "y" ? `${Number(value).toFixed(1)}%` : `$${Number(value).toFixed(2)}`,
                  name === "y" ? "Accuracy" : "Cost"
                ]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.model || ""}
              />
              <Scatter dataKey="y" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.strategyPerformance.map((strategy) => (
              <div key={strategy.strategy} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{strategy.strategy}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${strategy.performance}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{strategy.performance.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
