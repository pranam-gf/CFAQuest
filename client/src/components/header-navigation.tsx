import { ChartLine } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

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
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative
        ${isActive
          ? "bg-white/90 dark:bg-white/20 text-indigo-700 dark:text-white backdrop-blur-sm shadow-lg shadow-gray-200/20 dark:shadow-black/20"
          : "text-slate-600/80 hover:text-slate-900 dark:text-gray-300/80 dark:hover:text-white transition-all duration-200"
        }`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
};

export function HeaderNavigation() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ChartLine className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              CFA Arena
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2 p-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10">
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </nav>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}