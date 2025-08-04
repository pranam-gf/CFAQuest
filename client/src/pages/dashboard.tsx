import { HeaderNavigation } from "@/components/header-navigation";
import { OverviewMetrics } from "@/components/overview-metrics";
import { PerformanceCharts } from "@/components/performance-charts";
import { PricingCharts } from "@/components/pricing-charts";
import Footer from '@/components/footer';

export default function Dashboard() {

  const renderContent = () => {
    return (
      <div className="space-y-12">
        {/* Performance Overview Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-signifier">Performance Overview</h2>
          </div>
          <OverviewMetrics />
        </section>

        {/* Performance Charts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-signifier">MCQ & Essay Accuracy</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed performance breakdowns and distributions</p>
            </div>
          </div>
          <PerformanceCharts />
        </section>

        {/* Pricing Analysis Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-signifier">Pricing & Cost Analysis</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Cost efficiency and pricing comparisons across models</p>
            </div>
          </div>
          <PricingCharts />
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <HeaderNavigation />
      <main className="flex-grow p-4 pt-24 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-[#464348]/10 dark:via-blue-500/10 dark:to-[#464348]/20"></div>
        <div className="relative z-10">
          <div className="container mx-auto py-8">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
