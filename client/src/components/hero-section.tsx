import { useState } from "react"
import { HeroPerformanceChart } from "@/components/hero-performance-chart"
import { HeroPerformanceChartV2 } from "@/components/hero-performance-chart-v2"
import { motion } from "framer-motion"

// Custom chart navigation component with a toggle switch design
interface ChartNavProps {
  activeView: 'v1' | 'v2';
  onViewChange: (view: 'v1' | 'v2') => void;
}

const ChartNavigation = ({ activeView, onViewChange }: ChartNavProps) => {
  return (
    <div className="flex justify-center mt-8 mb-4">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onViewChange('v1')}
          className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
            activeView === 'v1' ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="relative z-10">Overall Performance</span>
          {activeView === 'v1' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
              style={{
                boxShadow: "0px 0px 8px 0px #3b82f6",
              }}
              layoutId="chart-view-underline"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => onViewChange('v2')}
          className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
            activeView === 'v2' ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="relative z-10">Leaderboard</span>
          {activeView === 'v2' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
              style={{
                boxShadow: "0px 0px 8px 0px #3b82f6",
              }}
              layoutId="chart-view-underline"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </nav>
    </div>
  );
};

export function HeroSection() {
  const [activeChartView, setActiveChartView] = useState<'v1' | 'v2'>('v1');
  return (
    <div className="relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 lg:pt-56 pb-0">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title and subtitle section */}
          <div className="relative">
            {/* Title and subtitle content */}
            <div className="relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium text-slate-900 dark:text-white leading-tight mb-6 sm:mb-8 px-2 sm:px-4 tracking-wide"
              >
                                <span className="block">Benchmarking AI</span>
                                <span className="animate-gradient-pan bg-[length:200%_auto] block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-200 dark:via-blue-300 dark:to-blue-400">in Finance</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4 sm:mb-6 mt-4 sm:mt-6 leading-relaxed px-4 font-light"
              >
                Comprehensive evaluation of language models across multiple reasoning strategies, 
                from zero-shot to advanced chain-of-thought techniques.
              </motion.p>
                            {/* AI Providers Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="mt-2 sm:mt-3 inline-flex items-center gap-1 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 border border-gray-300 dark:border-white/20 shadow-md shadow-gray-200/10 dark:shadow-black/10 mx-2"
              >
                <a 
                  href="/paper.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wide text-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                >
                Benchmarked on CFA Level 3
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-60"
                >
                  <path d="M6 2L14 2L14 10" />
                  <path d="M14 2L2 14" />
                </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Performance Chart - Outside max-width constraint */}
        <div className="relative z-20 mb-8 sm:mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
          {activeChartView === 'v1' && <HeroPerformanceChart />}
          {activeChartView === 'v2' && <HeroPerformanceChartV2 />}

          <ChartNavigation 
            activeView={activeChartView} 
            onViewChange={setActiveChartView} 
          />
        </div>
        
      </div>
    </div>
  )
}