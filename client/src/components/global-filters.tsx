import { useState, useEffect } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Building2, Database, Eye, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getProviderInfo } from "@/lib/provider-mapping";
import { ProviderLogo } from "@/components/provider-logo";

// Provider options with logos
const PROVIDER_OPTIONS = [
  { value: "all", label: "All Providers" },
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
  { value: "all", label: "All Context" },
  { value: "0-32k", label: "0-32K" },
  { value: "32k-100k", label: "32K-100K" },
  { value: "100k-500k", label: "100K-500K" },
  { value: "500k+", label: "500K+" },
];

interface GlobalFiltersProps {
  // Provider filter
  providerFilter: string;
  onProviderFilterChange: (value: string) => void;
  
  // Context length filter
  contextLengthFilter: string;
  onContextLengthFilterChange: (value: string) => void;
  
  // Column visibility
  availableColumns: Array<{ key: string; label: string }>;
  visibleColumns: string[];
  onColumnVisibilityChange: (columns: string[]) => void;
  
  // Additional filters (specific to each leaderboard)
  additionalFilters?: React.ReactNode;
  
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
    <div className={cn("space-y-3", className)}>
      {/* Single Line Filter Layout */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Provider Filter */}
        <DropdownMenu
          value={providerFilter}
          onValueChange={onProviderFilterChange}
          placeholder="Providers"
          options={PROVIDER_OPTIONS}
          icon={<Building2 className="h-4 w-4" />}
          dynamicWidth
          minWidth={140}
        />
        
        {/* Context Length Filter */}
        <DropdownMenu
          value={contextLengthFilter}
          onValueChange={onContextLengthFilterChange}
          placeholder="Context"
          options={CONTEXT_LENGTH_OPTIONS}
          icon={<Database className="h-4 w-4" />}
          dynamicWidth
        />

        {/* Additional Filters */}
        {additionalFilters}

        {/* Column Visibility Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10"
          >
            <Eye className="h-4 w-4 mr-1" />
            Columns
            <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", showColumnSelector && "rotate-180")} />
          </Button>

          <AnimatePresence>
            {showColumnSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-50 mt-1 w-64 rounded-md p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/60 dark:border-gray-700 shadow-xl"
                style={{ transformOrigin: "top center" }}
              >
                <div className="space-y-1 max-h-60 overflow-auto">
                  <div className="mb-2 px-3 py-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Show Columns
                    </span>
                  </div>
                  {availableColumns.map((column, index) => (
                    <motion.button
                      key={column.key}
                      type="button"
                      onClick={() => toggleColumn(column.key)}
                      className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-all duration-200 text-slate-700 dark:text-gray-200 font-medium hover:bg-white/60 dark:hover:bg-white/10 focus:bg-white/60 dark:focus:bg-white/10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.15,
                        delay: index * 0.03,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="truncate">{column.label}</span>
                      {visibleColumns.includes(column.key) && (
                        <motion.div
                          className="flex-shrink-0 ml-2"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15, delay: 0.1 }}
                        >
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
    </div>
  );
}

// Utility functions for filtering
export const filterByProvider = <T extends { model: string }>(data: T[], providerFilter: string): T[] => {
  if (!providerFilter || providerFilter === "all") return data;
  
  return data.filter(item => {
    const providerInfo = getProviderInfo(item.model);
    return providerInfo.name === providerFilter;
  });
};

export const filterByContextLength = <T extends { contextLength?: number }>(data: T[], contextLengthFilter: string): T[] => {
  if (!contextLengthFilter || contextLengthFilter === "all") return data;
  
  return data.filter(item => {
    const contextLength = item.contextLength || 0;
    
    switch (contextLengthFilter) {
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
};