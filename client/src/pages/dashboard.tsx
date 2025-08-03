import { HeaderNavigation } from "@/components/header-navigation";
import { OverviewMetrics } from "@/components/overview-metrics";
import { PerformanceCharts } from "@/components/performance-charts";
import { EvaluationTabs } from "@/components/evaluation-tabs";
import { ModelComparison } from "@/components/model-comparison";
import Footer from '@/components/footer';
import Overall from "@/pages/overall";

export default function Dashboard() {

  const renderContent = () => {
    return (
      <>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-signifier">Performance Overview</h2>
          </div>
          <OverviewMetrics />
          <PerformanceCharts />
        </section>
        <EvaluationTabs activeTab="mcq" onTabChange={() => {}} />
      </>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 min-h-screen flex flex-col">
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {renderContent()}
      </div>
      
      <Footer />
    </div>
  );
}
