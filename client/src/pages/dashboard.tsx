import { useState } from "react";
import { HeaderNavigation } from "@/components/header-navigation";
import { OverviewMetrics } from "@/components/overview-metrics";
import { PerformanceCharts } from "@/components/performance-charts";
import { EvaluationTabs } from "@/components/evaluation-tabs";
import { ModelComparison } from "@/components/model-comparison";
import Footer from '@/components/footer';
import Overall from "@/pages/overall";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 font-signifier">Performance Overview</h2>
              </div>
              <OverviewMetrics />
              <PerformanceCharts />
            </section>
            <EvaluationTabs activeTab="mcq" onTabChange={() => {}} />
          </>
        );
      case "mcq":
        return <EvaluationTabs activeTab="mcq" onTabChange={() => {}} />;
      case "essay":
        return <EvaluationTabs activeTab="essay" onTabChange={() => {}} />;
      case "compare":
        return <ModelComparison />;
      case "overall":
        return <Overall />;
      default:
        return (
          <>
            <OverviewMetrics />
            <PerformanceCharts />
            <EvaluationTabs activeTab="mcq" onTabChange={() => {}} />
          </>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {renderContent()}
      </div>
      
      <Footer />
    </div>
  );
}
