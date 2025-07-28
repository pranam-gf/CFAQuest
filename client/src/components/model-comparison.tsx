import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { McqEvaluation, EssayEvaluation } from "@/types/models";

export function ModelComparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const { data: mcqData = [] } = useQuery<McqEvaluation[]>({
    queryKey: ["/api/mcq-evaluations"],
  });

  const { data: essayData = [] } = useQuery<EssayEvaluation[]>({
    queryKey: ["/api/essay-evaluations"],
  });

  // Get unique model names
  const uniqueModels = Array.from(new Set([
    ...mcqData.map(m => m.model),
    ...essayData.map(e => e.model)
  ])).sort();

  const addModel = (model: string) => {
    if (model && !selectedModels.includes(model) && selectedModels.length < 3) {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const removeModel = (model: string) => {
    setSelectedModels(selectedModels.filter(m => m !== model));
  };

  const getModelData = (model: string) => {
    const mcqModel = mcqData.find(m => m.model === model);
    const essayModel = essayData.find(e => e.model === model);

    return {
      mcqAccuracy: mcqModel ? (mcqModel.accuracy * 100).toFixed(2) : "N/A",
      essayScore: essayModel ? essayModel.avgSelfGrade.toFixed(2) : "N/A",
      avgResponseTime: mcqModel ? mcqModel.avgTimePerQuestion.toFixed(2) : "N/A",
      totalCost: mcqModel ? mcqModel.totalCost.toFixed(2) : "N/A",
      costEfficiency: essayModel ? essayModel.cosinePerDollar.toFixed(2) : "N/A",
    };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Model Comparison Tool</CardTitle>
          <Select onValueChange={addModel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add Model" />
            </SelectTrigger>
            <SelectContent>
              {uniqueModels
                .filter(model => !selectedModels.includes(model))
                .map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {selectedModels.map(model => {
            const data = getModelData(model);
            return (
              <div key={model} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900 truncate">{model}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeModel(model)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">MCQ Accuracy:</span>
                    <span className="text-sm font-medium">{data.mcqAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Essay Score:</span>
                    <span className="text-sm font-medium">{data.essayScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Avg Response Time:</span>
                    <span className="text-sm font-medium">{data.avgResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Cost:</span>
                    <span className="text-sm font-medium">${data.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Cost Efficiency:</span>
                    <span className="text-sm font-medium">{data.costEfficiency}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {selectedModels.length < 3 && (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Add Model to Compare</div>
              </div>
            </div>
          )}
        </div>

        {selectedModels.length >= 2 && (
          <div className="mt-6 flex justify-center">
            <Button className="px-6 py-2">
              Generate Comparison Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
