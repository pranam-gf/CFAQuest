import { useState } from "react"
import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { HeroPerformanceChart } from "@/components/hero-performance-chart"
import { HeroPerformanceChartV2 } from "@/components/hero-performance-chart-v2"
import { motion } from "framer-motion"


const providerSlugs = [
  // AI Providers (using existing Simple Icons)
  "openai",
  "anthropic", 
  "google",
  "meta",
  
  // Generic tech/AI related icons that exist
  "react",
  "typescript", 
  "javascript",
  "python",
  "pytorch",
  "tensorflow",
  "github",
  "gitlab",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "googlecloud",
  "vercel",
  "nodejs",
  "nextdotjs"
]

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
          {/* Title and subtitle section with IconCloud behind */}
          <div className="relative">
            {/* Interactive Cloud - Behind title and subtitle, positioned lower to avoid header */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 sm:opacity-10 dark:opacity-10 dark:sm:opacity-20 z-0" style={{ top: '50px', bottom: '-150px' }}>
              <div className="scale-75 sm:scale-100 lg:scale-125">
                <IconCloud iconSlugs={providerSlugs} />
              </div>
            </div>
            
            {/* Title and subtitle content */}
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-slate-900 dark:text-white leading-tight mb-6 sm:mb-8 px-2 sm:px-4">
                <span className="block sm:whitespace-nowrap">Benchmarking AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#464348] to-indigo-600 dark:from-blue-400 dark:via-[#464348] dark:to-indigo-400">in Finance</span></span>
              </h1>

              {/* AI Providers Label */}
              <div className="inline-flex items-center gap-1 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 border border-gray-300 dark:border-white/20 shadow-md shadow-gray-200/10 dark:shadow-black/10 mx-2">
                <span className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide text-center">
                Benchmarked on CFA Level 3
                </span>
              </div>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-12 mt-6 sm:mt-10 leading-relaxed px-4">
                Comprehensive evaluation of language models across multiple reasoning strategies, 
                from zero-shot to advanced chain-of-thought techniques.
              </p>
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