import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { BookOpen, Trophy, Zap } from 'lucide-react'
import { useLocation } from "wouter"
import type { ReactNode } from "react"

const providerSlugs = [
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
  "claude",
  "gpt",
  "gemini",
  "command",
  "llama",
  "grok",
  "palmyra",
  "codestral",
  "magistral",
  "c4ai",
  "o1",
]

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children, icon, onClick }: NavLinkProps) => {
  const [location] = useLocation();
  // The `Overall` link should be active for both `/` and `/overall`
  const isActive = location === href || (href === "/" && location === "/overall");

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to the href
      window.location.href = href;
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
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-[#464348]/10 dark:via-blue-500/10 dark:to-[#464348]/20"></div>
      
      {/* Interactive Cloud - Adjusted for better harmony */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="w-full h-full min-h-screen flex items-center justify-center scale-125">
          <IconCloud iconSlugs={providerSlugs} />
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
            Benchmarking AI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#464348] to-indigo-600 dark:from-blue-400 dark:via-[#464348] dark:to-indigo-400">
              in Finance
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Comprehensive evaluation of language models across multiple reasoning strategies, 
            from zero-shot to advanced chain-of-thought techniques. Experience the future of AI benchmarking.
          </p>
          
          {/* Navigation Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Explore Benchmarks
            </h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <NavLink 
                href="/" 
                icon={<Trophy className="w-6 h-6" />}
              >
                Overall Leaderboard
              </NavLink>
              <NavLink 
                href="/mcq" 
                icon={<Zap className="w-6 h-6" />}
              >
                MCQ Results
              </NavLink>
              <NavLink 
                href="/essay" 
                icon={<BookOpen className="w-6 h-6" />}
              >
                Essay Results
              </NavLink>
            </div>
          </div>
          
          {/* AI Providers Label */}
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl px-6 py-2 border border-white/60 dark:border-white/20 shadow-md shadow-gray-200/10 dark:shadow-black/10">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 via-[#464348] to-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
              Benchmarking Leading AI Providers
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}