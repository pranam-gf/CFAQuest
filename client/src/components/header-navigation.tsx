import { ChartLine } from "lucide-react";
import { Link } from "wouter";

import { useLocation } from "wouter";

interface HeaderNavigationProps {}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [location] = useLocation();
  const active = location === href || (href === "/" && location === "/overall");
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
};

export function HeaderNavigation({
  activeTab = "overall",
  onTabChange = () => {},
}: HeaderNavigationProps) {
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
            <NavLink
              active={activeTab === "overview"}
              href="/dashboard"
            >
              Overview
            </NavLink>
            <NavLink
              active={activeTab === "mcq"}
              href="/mcq"
            >
              MCQ
            </NavLink>
            <NavLink
              active={activeTab === "essay"}
              href="/essay"
            >
              Essay
            </NavLink>
            <NavLink
              active={activeTab === "compare"}
              href="/compare"
            >
              Compare
            </NavLink>
            <NavLink
              active={activeTab === "overall"}
              href="/"
            >
              Overall
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}