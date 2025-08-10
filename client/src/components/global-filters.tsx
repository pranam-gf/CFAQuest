import { useState, useEffect } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getProviderInfo } from "@/lib/provider-mapping";
import { ProviderLogo } from "@/components/provider-logo";
import { useLocation } from "wouter";
import { useView } from "@/pages/overall";
import type { ReactNode } from "react";

// Provider options with logos
const PROVIDER_OPTIONS = [
  { value: "Anthropic", label: "Anthropic" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "Google", label: "Google" },
  { value: "Cohere", label: "Cohere" },
  { value: "DeepSeek", label: "DeepSeek" },
  { value: "Mistral", label: "Mistral" },
  { value: "xAI", label: "xAI" },
  { value: "Groq", label: "Groq" },
  { value: "Meta", label: "Meta" },
  { value: "Writer", label: "Writer" },
];

// Context length options
const CONTEXT_LENGTH_OPTIONS = [
  { value: "0-32k", label: "0-32K" },
  { value: "32k-100k", label: "32K-100K" },
  { value: "100k-500k", label: "100K-500K" },
  { value: "500k+", label: "500K+" },
];

// View Filter Options
const VIEW_TYPE_OPTIONS = [
  { value: "overall", label: "Overall Leaderboard" },
  { value: "mcq", label: "MCQ Results" },
  { value: "essay", label: "Essay Results" },
];

interface GlobalFiltersProps {
  // Provider filter (now supports multi-select)
  providerFilter: string | string[];
  onProviderFilterChange: (value: string | string[]) => void;
  
  // Context length filter (now supports multi-select)
  contextLengthFilter: string | string[];
  onContextLengthFilterChange: (value: string | string[]) => void;
  
  // Column visibility
  availableColumns: Array<{ key: string; label: string }>;
  visibleColumns: string[];
  onColumnVisibilityChange: (columns: string[]) => void;
  
  // Additional filters (specific to each leaderboard)
  additionalFilters?: React.ReactNode;
  
  // View filter
  viewFilter?: string;
  onViewFilterChange?: (view: string) => void;
  
  // Collapse state
  className?: string;
}

export function GlobalFilters({
  providerFilter,
  onProviderFilterChange,
  contextLengthFilter,
  onContextLengthFilterChange,
  availableColumns,
  visibleColumns,
  onColumnVisibilityChange,
  additionalFilters,
  viewFilter,
  onViewFilterChange,
  className
}: GlobalFiltersProps) {
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const toggleColumn = (columnKey: string) => {
    if (visibleColumns.includes(columnKey)) {
      onColumnVisibilityChange(visibleColumns.filter(key => key !== columnKey));
    } else {
      onColumnVisibilityChange([...visibleColumns, columnKey]);
    }
  };


  // Create column visibility dropdown options
  const columnOptions = availableColumns.map(col => ({
    value: col.key,
    label: col.label,
    checked: visibleColumns.includes(col.key)
  }));

  return (
    <div className={cn("flex flex-wrap lg:flex-nowrap items-center gap-3 flex-1", className)}>
      {/* View Filter */}
      {viewFilter && onViewFilterChange && (
        <DropdownMenu
          value={viewFilter}
          onValueChange={onViewFilterChange}
          placeholder="View Type"
          dynamicWidth={false}
          minWidth={200}
          className="flex-1 min-w-[200px] max-w-[250px]"
          options={VIEW_TYPE_OPTIONS}
        />
      )}
      
      {/* Provider Filter - Multi-select */}
      <MultiSelectDropdown
        value={Array.isArray(providerFilter) ? providerFilter.filter(v => v !== 'all') : (providerFilter && providerFilter !== 'all' ? [providerFilter] : [])}
        onValueChange={(values) => onProviderFilterChange(values)}
        placeholder="AI Providers"
        options={PROVIDER_OPTIONS}
        minWidth={160}
        className="flex-1 min-w-[160px] max-w-[200px]"
      />
      
      {/* Context Length Filter - Multi-select */}
      <MultiSelectDropdown
        value={Array.isArray(contextLengthFilter) ? contextLengthFilter.filter(v => v !== 'all') : (contextLengthFilter && contextLengthFilter !== 'all' ? [contextLengthFilter] : [])}
        onValueChange={(values) => onContextLengthFilterChange(values)}
        placeholder="Context Length"
        options={CONTEXT_LENGTH_OPTIONS}
        minWidth={160}
        className="flex-1 min-w-[160px] max-w-[200px]"
      />

      {/* Additional Filters */}
      {additionalFilters}

      {/* Column Visibility Dropdown */}
      <div className="relative flex-1 min-w-[160px] max-w-[200px]">
        <Button
          variant="outline"
          className="h-10 w-full bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
          onClick={() => setShowColumnSelector(!showColumnSelector)}
        >
          <span className="font-medium">Columns</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-600 dark:text-gray-300", showColumnSelector && "rotate-180")} />
        </Button>

        <AnimatePresence>
          {showColumnSelector && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 mt-1 w-52 rounded-md p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/60 dark:border-gray-700 shadow-xl"
              style={{ transformOrigin: "top center" }}
            >
              <div className="space-y-0.5 max-h-48 overflow-auto">
                <div className="mb-1 px-2 py-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-white">
                    Show Columns
                  </span>
                </div>
                {availableColumns.map((column, index) => (
                  <motion.button
                    key={column.key}
                    type="button"
                    onClick={() => toggleColumn(column.key)}
                    className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-all duration-200 text-slate-700 dark:text-gray-200 font-medium hover:bg-white/60 dark:hover:bg-white/10 focus:bg-white/60 dark:focus:bg-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.15,
                      delay: index * 0.02,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="truncate text-sm">{column.label}</span>
                    {visibleColumns.includes(column.key) && (
                      <motion.div
                        className="flex-shrink-0 ml-1.5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.1 }}
                      >
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility functions for filtering
export const filterByProvider = <T extends { model: string }>(data: T[], providerFilter: string | string[]): T[] => {
  const filters = Array.isArray(providerFilter) ? providerFilter : [providerFilter];
  
  if (filters.includes("all") || filters.length === 0 || !providerFilter) return data;
  
  return data.filter(item => {
    const providerInfo = getProviderInfo(item.model);
    return filters.includes(providerInfo.name);
  });
};

export const filterByContextLength = <T extends { contextLength?: number }>(data: T[], contextLengthFilter: string | string[]): T[] => {
  const filters = Array.isArray(contextLengthFilter) ? contextLengthFilter : [contextLengthFilter];
  
  if (filters.includes("all") || filters.length === 0) return data;
  
  return data.filter(item => {
    const contextLength = item.contextLength || 0;
    
    return filters.some(filter => {
      switch (filter) {
        case "0-32k":
          return contextLength <= 32000;
        case "32k-100k":
          return contextLength > 32000 && contextLength <= 100000;
        case "100k-500k":
          return contextLength > 100000 && contextLength <= 500000;
        case "500k+":
          return contextLength > 500000;
        default:
          return true;
      }
    });
  });
};