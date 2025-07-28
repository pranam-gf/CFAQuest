import { ChartLine } from "lucide-react";

interface HeaderNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavLink = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
      active
        ? "bg-slate-100 text-slate-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    {children}
  </button>
);

export function HeaderNavigation({
  activeTab,
  onTabChange,
}: HeaderNavigationProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <ChartLine className="text-white w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                AI Leaderboard
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2 p-1 bg-slate-200/50 rounded-lg">
            <NavLink
              active={activeTab === "overview"}
              onClick={() => onTabChange("overview")}
            >
              Overview
            </NavLink>
            <NavLink
              active={activeTab === "mcq"}
              onClick={() => onTabChange("mcq")}
            >
              MCQ
            </NavLink>
            <NavLink
              active={activeTab === "essay"}
              onClick={() => onTabChange("essay")}
            >
              Essay
            </NavLink>
            <NavLink
              active={activeTab === "compare"}
              onClick={() => onTabChange("compare")}
            >
              Compare
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}