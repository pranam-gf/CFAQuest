import React from "react";
import { Input } from "@/components/ui/input";
import { GlobalFilters } from "@/components/global-filters";
import { Search } from "lucide-react";

interface CommonFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  modelTypeFilter?: string;
  onModelTypeFilterChange?: (filter: string) => void;
  strategyFilter?: string | string[];
  onStrategyFilterChange?: (filter: string | string[]) => void;
  providerFilter: string | string[];
  onProviderFilterChange: (filter: string | string[]) => void;
  contextLengthFilter: string | string[];
  onContextLengthFilterChange: (filter: string | string[]) => void;
  availableColumns: Array<{ key: string; label: string }>;
  visibleColumns: string[];
  onColumnVisibilityChange: (columns: string[]) => void;
  viewFilter?: string;
  onViewFilterChange?: (view: string) => void;
  additionalFilters?: React.ReactNode;
}

export const CommonFilters = React.memo(function CommonFilters({
  searchTerm,
  onSearchTermChange,
  modelTypeFilter,
  onModelTypeFilterChange,
  strategyFilter,
  onStrategyFilterChange,
  providerFilter,
  onProviderFilterChange,
  contextLengthFilter,
  onContextLengthFilterChange,
  availableColumns,
  visibleColumns,
  onColumnVisibilityChange,
  viewFilter,
  onViewFilterChange,
  additionalFilters
}: CommonFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-6">
      <div className="relative flex-1 min-w-0 lg:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4 z-10 pointer-events-none" />
        <Input
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10 bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 w-full"
        />
      </div>
      <GlobalFilters
        providerFilter={providerFilter}
        onProviderFilterChange={onProviderFilterChange}
        contextLengthFilter={contextLengthFilter}
        onContextLengthFilterChange={onContextLengthFilterChange}
        modelTypeFilter={modelTypeFilter}
        onModelTypeFilterChange={onModelTypeFilterChange}
        strategyFilter={strategyFilter}
        onStrategyFilterChange={onStrategyFilterChange}
        availableColumns={availableColumns}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={onColumnVisibilityChange}
        viewFilter={viewFilter}
        onViewFilterChange={onViewFilterChange}
        additionalFilters={additionalFilters}
      />
    </div>
  );
});