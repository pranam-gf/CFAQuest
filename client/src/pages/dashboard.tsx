import { HeaderNavigation } from "@/components/header-navigation";
import { OverviewMetrics } from "@/components/overview-metrics";
import { PerformanceCharts } from "@/components/performance-charts";
import { PricingCharts } from "@/components/pricing-charts";
import Footer from '@/components/footer';
import { motion } from 'framer-motion';

export default function Dashboard() {

  const renderContent = () => {
    return (
      <div className="space-y-16">
        {/* Performance Overview Section */}
        <section>
          <motion.div 
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">Performance Overview</h2>
          </motion.div>
          <OverviewMetrics />
        </section>


        {/* Performance Charts Section */}
        <section>
          <motion.div 
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">MCQ & Essay Accuracy</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed performance breakdowns and distributions</p>
            </div>
          </motion.div>
          <PerformanceCharts />
        </section>


        {/* Pricing Analysis Section */}
        <section>
          <motion.div 
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">Pricing & Cost Analysis</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Cost efficiency and pricing comparisons across models</p>
            </div>
          </motion.div>
          <PricingCharts />
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderNavigation />
      <main className="flex-grow p-4 pt-24 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
        {/* Floating glass elements */}
        <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-white/10 dark:to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
        <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 right-40 w-48 h-32 bg-gradient-to-br from-gray-200/25 to-gray-300/15 dark:from-white/8 dark:to-white/3 rounded-2xl transform -rotate-6 blur-sm"></div>
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
