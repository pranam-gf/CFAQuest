import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { McqLeaderboard } from "./mcq-leaderboard";
import { EssayLeaderboard } from "./essay-leaderboard";

interface EvaluationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function EvaluationTabs({ activeTab, onTabChange }: EvaluationTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mcq">MCQ Evaluation</TabsTrigger>
        <TabsTrigger value="essay">Essay Evaluation</TabsTrigger>
      </TabsList>
      <TabsContent value="mcq" className="mt-6">
        <McqLeaderboard />
      </TabsContent>
      <TabsContent value="essay" className="mt-6">
        <EssayLeaderboard />
      </TabsContent>
    </Tabs>
  );
}
