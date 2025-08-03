import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const [location] = useLocation();
  // The `Overall` link should be active for both `/` and `/overall`
  const isActive = location === href || (href === "/" && location === "/overall");

  return (
    <Link
      href={href}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
      }`}
    >
      {children}
    </Link>
  );
};

export function SectionNavigation() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Explore Benchmarks
          </h2>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            <NavLink href="/">Overall Leaderboard</NavLink>
            <NavLink href="/mcq">MCQ Results</NavLink>
            <NavLink href="/essay">Essay Results</NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}