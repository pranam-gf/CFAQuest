import { useState } from "react";
import { ChartLine, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function HeaderNavigation({ activeTab, onTabChange }: HeaderNavigationProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">CFA Level 3 AI Leaderboard</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onTabChange("overview")}
                className={`pb-4 text-sm font-medium ${
                  activeTab === "overview"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => onTabChange("mcq")}
                className={`pb-4 text-sm font-medium ${
                  activeTab === "mcq"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                MCQ Evaluation
              </button>
              <button
                onClick={() => onTabChange("essay")}
                className={`pb-4 text-sm font-medium ${
                  activeTab === "essay"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Essay Evaluation
              </button>
              <button
                onClick={() => onTabChange("compare")}
                className={`pb-4 text-sm font-medium ${
                  activeTab === "compare"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Model Compare
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
