import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { BookOpen, Trophy, Zap } from 'lucide-react'
import { useLocation } from "wouter"
import type { ReactNode } from "react"
import { useView } from "@/pages/overall"
import { HeroPerformanceChart } from "@/components/hero-performance-chart"


const providerSlugs = [
  // AI Providers
  "openai",
  "anthropic", 
  "google",
  "cohere",
  "mistral",
  "deepseek",
  "xai",
  "groq",
  "meta",
  "writer",
  "alibaba",
  
  // Model Names
  "claude",
  "gpt",
  "gemini",
  "command",
  "llama",
  "grok",
  "palmyra",
  "codestral"
]

interface NavLinkProps {
  viewType: 'overall' | 'mcq' | 'essay';
  children: ReactNode;
  icon: ReactNode;
}

const NavLink = ({ viewType, children, icon }: NavLinkProps) => {
  const [location] = useLocation();
  const { currentView, setCurrentView } = useView();
  
  // Only show view switching if we're on the main page
  const isMainPage = location === "/" || location === "/overall";
  const isActive = isMainPage ? currentView === viewType : false;

  const handleClick = () => {
    if (isMainPage) {
      setCurrentView(viewType);
    } else {
      // If not on main page, navigate to main page with the view
      const routes = { overall: "/", mcq: "/mcq", essay: "/essay" };
      window.location.href = routes[viewType];
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-3 backdrop-blur-md rounded-2xl px-6 py-3 border shadow-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600/90 text-white border-blue-500/50 shadow-blue-600/25"
          : "bg-white/60 dark:bg-white/10 border-white/50 dark:border-white/20 shadow-gray-200/20 dark:shadow-black/20 hover:bg-white/80 dark:hover:bg-white/20"
      }`}
    >
      <div className={`w-6 h-6 ${isActive ? 'text-white' : ''}`}>
        {icon}
      </div>
      <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-700 dark:text-gray-200'}`}>
        {children}
      </span>
    </button>
  );
};

export function HeroSection() {
  return (
    <div className="relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-0">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title and subtitle section with IconCloud behind */}
          <div className="relative">
            {/* Interactive Cloud - Behind title and subtitle, positioned lower to avoid header */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 z-0" style={{ top: '50px', bottom: '-150px' }}>
              <div className="scale-125">
                <IconCloud iconSlugs={providerSlugs} />
              </div>
            </div>
            
            {/* Title and subtitle content */}
            <div className="relative z-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
                Benchmarking AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#464348] to-indigo-600 dark:from-blue-400 dark:via-[#464348] dark:to-indigo-400">in Finance</span>
              </h1>

              {/* AI Providers Label */}
              <div className="inline-flex items-center gap-1 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl px-6 py-2 border border-white/60 dark:border-white/20 shadow-md shadow-gray-200/10 dark:shadow-black/10">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 via-[#464348] to-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                Currently Benchmarked on CFA Level 3
                </span>
              </div>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 mt-10 leading-relaxed">
                Comprehensive evaluation of language models across multiple reasoning strategies, 
                from zero-shot to advanced chain-of-thought techniques.
              </p>
            </div>
          </div>
        </div>
        
        {/* Performance Chart - Outside max-width constraint */}
        <div className="mb-12 -mx-6 lg:-mx-8">
          <HeroPerformanceChart />
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          {/* Navigation Section */}
          <div className="mb-0 mt-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Explore Benchmarks
            </h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <NavLink 
                viewType="overall" 
                icon={<Trophy className="w-6 h-6" />}
              >
                Overall Leaderboard
              </NavLink>
              <NavLink 
                viewType="mcq" 
                icon={<Zap className="w-6 h-6" />}
              >
                MCQ Results
              </NavLink>
              <NavLink 
                viewType="essay" 
                icon={<BookOpen className="w-6 h-6" />}
              >
                Essay Results
              </NavLink>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}