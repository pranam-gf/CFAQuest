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
                            {/* CFA Level 3 Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="mt-2 sm:mt-3 inline-flex items-center gap-2"
              >
                <a 
                  href="/paper.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-blue-200/40 dark:border-blue-300/30 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-300/60 dark:hover:border-blue-400/50 transition-all duration-300 before:absolute before:bottom-[-10%] before:left-1/2 before:z-[0] before:h-[15%] before:w-[80%] before:-translate-x-1/2 before:bg-blue-500/30 before:blur-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  {/* CFA Badge Icon */}
                  <div className="flex items-center justify-center w-15 h-15 sm:w-15 sm:h-15 rounded-full bg-transparent">
                    <img 
                      src="/cfalogo.png" 
                      alt="CFA Institute Logo" 
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                    />
                  </div>
                  
                  <span className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-200">
                    Benchmarked on CFA Level 3
                  </span>
                  
                  {/* Minimalist Arrow Icon */}
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    className="text-slate-600 dark:text-slate-400 opacity-70 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-200"
                  >
                    <path 
                      d="M3 9L9 3M9 9V3H3" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
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