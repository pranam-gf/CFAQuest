import { ChartLine } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import GitHubEssayButton from "@/components/ui/button-github-essay";
import GitHubMcqButton from "@/components/ui/button-github-mcq";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const [location] = useLocation();
  const isActive = location === href || (href === "/" && location === "/overall");

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
          style={{
            boxShadow: "0px 0px 8px 0px #3b82f6",
          }}
          layoutId="underline"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

export function HeaderNavigation() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <img src="/logo.png" alt="CFA Arena Logo" className="w-10 h-10 dark:invert" />
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink href="/">Overall</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <GitHubEssayButton />
              <GitHubMcqButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}