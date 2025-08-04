import React from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { GlobalFilters } from "@/components/global-filters";
import { Search, Cpu, Target } from "lucide-react";

interface CommonFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  modelTypeFilter?: string;
  onModelTypeFilterChange?: (filter: string) => void;
  strategyFilter: string | string[];
  onStrategyFilterChange: (filter: string | string[]) => void;
  providerFilter: string | string[];
  onProviderFilterChange: (filter: string | string[]) => void;
  contextLengthFilter: string | string[];
  onContextLengthFilterChange: (filter: string | string[]) => void;
  availableColumns: Array<{ key: string; label: string }>;
  visibleColumns: string[];
  onColumnVisibilityChange: (columns: string[]) => void;
  strategyOptions: Array<{ value: string; label: string }>;
  isMultiSelectStrategy?: boolean;
  showModelTypeFilter?: boolean;
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
  strategyOptions,
  isMultiSelectStrategy = false,
  showModelTypeFilter = true
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
        availableColumns={availableColumns}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={onColumnVisibilityChange}
        additionalFilters={
          <>
            {showModelTypeFilter && onModelTypeFilterChange && (
              <DropdownMenu
                value={modelTypeFilter || ""}
                onValueChange={onModelTypeFilterChange}
                placeholder="Model Type"
                icon={<Cpu className="h-4 w-4 text-slate-600 dark:text-gray-300" />}
                dynamicWidth={false}
                minWidth={160}
                className="flex-1 min-w-[160px] max-w-[200px]"
                options={[
                  { value: "all", label: "All" },
                  { value: "Reasoning", label: "Reasoning" },
                  { value: "Non-Reasoning", label: "Non-Reasoning" }
                ]}
              />
            )}
            {isMultiSelectStrategy ? (
              <MultiSelectDropdown
                value={strategyFilter as string[]}
                onValueChange={onStrategyFilterChange as (filter: string[]) => void}
                placeholder="Strategies"
                icon={<Target className="h-4 w-4 text-slate-600 dark:text-gray-300" />}
                minWidth={160}
                className="flex-1 min-w-[160px] max-w-[200px]"
                options={strategyOptions}
              />
            ) : (
              <DropdownMenu
                value={strategyFilter as string}
                onValueChange={onStrategyFilterChange as (filter: string) => void}
                placeholder="Strategy"
                icon={<Target className="h-4 w-4 text-slate-600 dark:text-gray-300" />}
                dynamicWidth={false}
                minWidth={160}
                className="flex-1 min-w-[160px] max-w-[200px]"
                options={strategyOptions}
              />
            )}
          </>
        }
      />
    </div>
  );
});