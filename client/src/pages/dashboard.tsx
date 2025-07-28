import { useState } from "react";
import { HeaderNavigation } from "@/components/header-navigation";
import { OverviewMetrics } from "@/components/overview-metrics";
import { PerformanceCharts } from "@/components/performance-charts";
import { EvaluationTabs } from "@/components/evaluation-tabs";
import { ModelComparison } from "@/components/model-comparison";

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
    <div className="bg-slate-50 min-h-screen">
      <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600">
            Funded and backed by <span className="font-medium text-slate-800">Goodfin Research</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
