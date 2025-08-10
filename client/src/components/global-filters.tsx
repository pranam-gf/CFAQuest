import { useState, useEffect, useRef } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getProviderInfo } from "@/lib/provider-mapping";
import { ProviderLogo } from "@/components/provider-logo";
import { useLocation } from "wouter";
import { useView } from "@/pages/overall";
import type { ReactNode } from "react";

// Provider options based on actual supported providers from provider-mapping.tsx
const PROVIDER_OPTIONS = [
  { value: "Anthropic", label: "Anthropic" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "Google", label: "Google" },
  { value: "DeepSeek", label: "DeepSeek" },
  { value: "Mistral", label: "Mistral" },
  { value: "xAI", label: "xAI" },
  { value: "Meta", label: "Meta" },
  { value: "Writer", label: "Writer" },
];

// Helper function to get a sample model name for each provider
const getModelNameForProvider = (providerName: string): string => {
  const providerToModelMap: Record<string, string> = {
    'Anthropic': 'claude-3.5-sonnet',
    'OpenAI': 'gpt-4o',
    'Google': 'gemini-2.0-flash-exp',
    'DeepSeek': 'deepseek-v3',
    'Mistral': 'mistral-large-2411',
    'xAI': 'grok-beta',
    'Meta': 'llama-3.3-70b-instruct',
    'Writer': 'palmyra-fin-default',
  };
  
  return providerToModelMap[providerName] || 'unknown-model';
};

interface ProviderSelectionDropdownProps {
  selectedProviders: string[];
  onSelectProvider: (providerId: string) => void;
}

function ProviderSelectionDropdown({ selectedProviders, onSelectProvider }: ProviderSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProviders = PROVIDER_OPTIONS.filter(provider =>
    provider.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedText = () => {
    if (selectedProviders.length === 0) return "AI Providers";
    if (selectedProviders.length === 1) return selectedProviders[0];
    return `${selectedProviders.length} providers`;
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[160px] max-w-[200px]">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
      >
        <span className="font-medium truncate">{getSelectedText()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-600 dark:text-gray-300", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-80 left-0 right-0 mx-auto origin-top rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-6 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/80 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
            <ScrollArea className="h-48">
              <div className="p-2 pt-0">
                {filteredProviders.map(provider => (
                  <div
                    key={provider.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => onSelectProvider(provider.value)}
                  >
                    <Checkbox
                      checked={selectedProviders.includes(provider.value)}
                      onCheckedChange={() => onSelectProvider(provider.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{provider.label}</span>
                      <ProviderLogo modelName={getModelNameForProvider(provider.value)} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ContextLengthSelectionDropdownProps {
  selectedContextLengths: string[];
  onSelectContextLength: (contextLengthId: string) => void;
}

function ContextLengthSelectionDropdown({ selectedContextLengths, onSelectContextLength }: ContextLengthSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedText = () => {
    if (selectedContextLengths.length === 0) return "Context Length";
    if (selectedContextLengths.length === 1) return CONTEXT_LENGTH_OPTIONS.find(opt => opt.value === selectedContextLengths[0])?.label || selectedContextLengths[0];
    return `${selectedContextLengths.length} ranges`;
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[160px] max-w-[200px]">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
      >
        <span className="font-medium truncate">{getSelectedText()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-600 dark:text-gray-300", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-52 left-0 right-0 mx-auto origin-top rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <ScrollArea className="h-32">
              <div className="p-2">
                {CONTEXT_LENGTH_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => onSelectContextLength(option.value)}
                  >
                    <Checkbox
                      checked={selectedContextLengths.includes(option.value)}
                      onCheckedChange={() => onSelectContextLength(option.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ColumnSelectionDropdownProps {
  availableColumns: Array<{ key: string; label: string }>;
  visibleColumns: string[];
  onToggleColumn: (columnKey: string) => void;
}

function ColumnSelectionDropdown({ availableColumns, visibleColumns, onToggleColumn }: ColumnSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedText = () => {
    if (visibleColumns.length === availableColumns.length) return "All Columns";
    if (visibleColumns.length === 0) return "No Columns";
    return "Columns";
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[160px] max-w-[200px]">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
      >
        <span className="font-medium truncate">{getSelectedText()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-600 dark:text-gray-300", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-52 left-0 right-0 mx-auto origin-top rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <ScrollArea className="h-40">
              <div className="p-2">
                <div className="mb-1 px-2 py-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-white">
                    Show Columns
                  </span>
                </div>
                {availableColumns.map((column, index) => (
                  <motion.div
                    key={column.key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => onToggleColumn(column.key)}
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
                    <Checkbox
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => onToggleColumn(column.key)}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{column.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      
      {/* Provider Filter - Custom dropdown with search and logos */}
      <ProviderSelectionDropdown
        selectedProviders={Array.isArray(providerFilter) ? providerFilter.filter(v => v !== 'all') : (providerFilter && providerFilter !== 'all' ? [providerFilter] : [])}
        onSelectProvider={(providerId) => {
          const currentProviders = Array.isArray(providerFilter) ? providerFilter.filter(v => v !== 'all') : (providerFilter && providerFilter !== 'all' ? [providerFilter] : []);
          const updatedProviders = currentProviders.includes(providerId)
            ? currentProviders.filter(id => id !== providerId)
            : [...currentProviders, providerId];
          onProviderFilterChange(updatedProviders);
        }}
      />
      
      {/* Context Length Filter - Custom dropdown with search */}
      <ContextLengthSelectionDropdown
        selectedContextLengths={Array.isArray(contextLengthFilter) ? contextLengthFilter.filter(v => v !== 'all') : (contextLengthFilter && contextLengthFilter !== 'all' ? [contextLengthFilter] : [])}
        onSelectContextLength={(contextLengthId) => {
          const currentContextLengths = Array.isArray(contextLengthFilter) ? contextLengthFilter.filter(v => v !== 'all') : (contextLengthFilter && contextLengthFilter !== 'all' ? [contextLengthFilter] : []);
          const updatedContextLengths = currentContextLengths.includes(contextLengthId)
            ? currentContextLengths.filter(id => id !== contextLengthId)
            : [...currentContextLengths, contextLengthId];
          onContextLengthFilterChange(updatedContextLengths);
        }}
      />

      {/* Additional Filters */}
      {additionalFilters}

      {/* Column Visibility Dropdown - Custom dropdown with search */}
      <ColumnSelectionDropdown
        availableColumns={availableColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />
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