import { ChartLine } from "lucide-react";
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
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
};

export function HeaderNavigation() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b-2 border-red-500 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <ChartLine className="text-white w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                CFA ARENA
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2 p-1 bg-slate-200/50 rounded-lg">
            <NavLink href="/dashboard">Overview</NavLink>
            <NavLink href="/mcq">MCQ</NavLink>
            <NavLink href="/essay">Essay</NavLink>
            <NavLink href="/compare">Compare</NavLink>
            <NavLink href="/">Overall</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}