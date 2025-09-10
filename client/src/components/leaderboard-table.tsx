import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { MedalIcon } from "@/components/medal-icon";
import { ProviderLogo } from "@/components/provider-logo";
import { formatContextLength, getContextLengthColor } from "@/lib/context-length-utils";
import { getDisplayName } from "@/lib/model-display-names";

export type ColumnType = 
  | 'rank' 
  | 'model' 
  | 'provider' 
  | 'provider-tooltip'
  | 'accuracy' 
  | 'progress-bar'
  | 'percentage' 
  | 'currency' 
  | 'number' 
  | 'decimal'
  | 'reasoning' 
  | 'context' 
  | 'strategy'
  | 'custom';

export interface ColumnDefinition<T = any> {
  key: string;
  label: string;
  type: ColumnType;
  sortable?: boolean;
  width?: string;
  className?: string;
  tooltip?: string;
  tooltipContent?: Record<string, string>;
  render?: (value: any, row: T) => React.ReactNode;
  getValue?: (row: T) => any;
  maxValue?: number; // For progress bars
}

interface LeaderboardTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  isLoading?: boolean;
  showRank?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  visibleColumns?: string[]; // Optional array of visible column keys
}

export function LeaderboardTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  showRank = false,
  onSort,
  sortKey,
  sortDirection,
  visibleColumns
}: LeaderboardTableProps<T>) {
  const [internalSortKey, setInternalSortKey] = useState<string>("");
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('desc');
  const [displayCount, setDisplayCount] = useState<number>(10);

  const currentSortKey = sortKey || internalSortKey;
  const currentSortDirection = sortDirection || internalSortDirection;

  // Filter columns based on visibility
  const filteredColumns = visibleColumns 
    ? columns.filter(column => visibleColumns.includes(column.key))
    : columns;

  // Get the data to display (first displayCount items)
  const displayedData = data.slice(0, displayCount);
  const hasMoreData = data.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const handleSort = (key: string) => {
    const newDirection = currentSortKey === key && currentSortDirection === 'desc' ? 'asc' : 'desc';
    
    if (onSort) {
      onSort(key, newDirection);
    } else {
      setInternalSortKey(key);
      setInternalSortDirection(newDirection);
    }
  };

  const renderCellContent = (column: ColumnDefinition<T>, row: T, index: number) => {
    const value = column.getValue ? column.getValue(row) : row[column.key];

    switch (column.type) {
      case 'rank':
        return (
          <div className="flex items-center justify-center">
            <MedalIcon rank={index + 1} />
          </div>
        );

      case 'model':
        return (
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {getDisplayName(value)}
          </div>
        );

      case 'provider':
        return <ProviderLogo modelName={row.model || value} showName />;

      case 'provider-tooltip':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ProviderLogo modelName={row.model || value} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{(row.model || value).split("/")[0] || (row.model || value).split("-")[0] || "Unknown"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

      case 'accuracy':
      case 'progress-bar':
        const percentage = column.type === 'accuracy' ? value * 100 : (value / (column.maxValue || 4)) * 100;
        const barColor = 'bg-emerald-500';
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
              {column.type === 'accuracy' ? `${Math.round(percentage)}%` : value}
            </span>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 border border-gray-300/50 dark:border-transparent">
              <div
                className={`${barColor} h-2 rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );

      case 'percentage':
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {value * 100}%
          </div>
        );

      case 'currency':
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            ${value}
          </div>
        );

      case 'number':
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {value}
          </div>
        );

      case 'decimal':
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {value}
          </div>
        );

      case 'reasoning':
        return (
          <div className="flex items-center justify-center">
            {row.modelType === "Reasoning" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        );

      case 'context':
        return (
          <span className={`text-sm font-medium ${getContextLengthColor(value || 0)}`}>
            {formatContextLength(value || 0)}
          </span>
        );

      case 'strategy':
        const strategyDisplayNames: Record<string, string> = {
          "Default (Single Pass)": "Zero-Shot",
          "Self-Consistency CoT (N=3 samples)": "SC-CoT N=3",
          "Self-Consistency CoT (N=5 samples)": "SC-CoT N=5",
          "Self-Discover": "Self-Discover",
          "Default": "Zero-Shot",
          "Self-Consistency_N3": "SC-CoT N=3",
          "Self-Consistency_N5": "SC-CoT N=5",
        };
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {strategyDisplayNames[value] || value}
          </div>
        );

      case 'custom':
        return column.render ? column.render(value, row) : value;

      default:
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {value}
          </div>
        );
    }
  };

  const renderHeader = (column: ColumnDefinition<T>) => {
    if (column.sortable) {
      return (
        <Button 
          variant="ghost" 
          onClick={() => handleSort(column.key)} 
          className="h-auto p-0 font-medium dark:text-white"
        >
          {column.label} <ArrowUpDown className="ml-1 w-3 h-3" />
        </Button>
      );
    }

    if (column.tooltip && column.tooltipContent) {
      return (
        <div className={`flex items-center ${column.className?.includes('text-center') ? 'justify-center' : ''}`}>
          {column.label}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                {Object.entries(column.tooltipContent).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return column.label;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-visible relative">
      <Table>
        <TableHeader>
          <TableRow>
            {showRank && (
              <TableHead className="font-medium dark:text-white">Rank</TableHead>
            )}
            {filteredColumns.map((column) => (
              <TableHead 
                key={column.key}
                className={`font-medium dark:text-white ${column.width || ''} ${column.className || ''}`}
              >
                {renderHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedData.map((row, index) => {
            // Medal styling for top 3 positions
            const getMedalStyling = (position: number) => {
              switch (position) {
                case 0: // Gold
                  return {
                    rowClass: "!border-l-4 !border-l-yellow-400/80 bg-yellow-50/50 dark:bg-yellow-900/20 hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30",
                    stripColor: "bg-yellow-400"
                  };
                case 1: // Silver
                  return {
                    rowClass: "!border-l-4 !border-l-slate-400/80 bg-slate-50/50 dark:bg-slate-700/20 hover:bg-slate-100/70 dark:hover:bg-slate-700/30",
                    stripColor: "bg-slate-400"
                  };
                case 2: // Bronze
                  return {
                    rowClass: "!border-l-4 !border-l-orange-500/80 bg-orange-50/50 dark:bg-orange-900/20 hover:bg-orange-100/70 dark:hover:bg-orange-900/30",
                    stripColor: "bg-orange-500"
                  };
                default:
                  return {
                    rowClass: "",
                    stripColor: ""
                  };
              }
            };

            const styling = getMedalStyling(index);

            return (
              <motion.tr 
                key={row.id || index} 
                className={cn("transition-colors", styling.rowClass)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {showRank && (
                  <TableCell className="font-light">
                    {renderCellContent({ key: 'rank', label: 'Rank', type: 'rank' }, row, index)}
                  </TableCell>
                )}
                {filteredColumns.map((column) => (
                  <TableCell key={column.key} className={`font-light ${column.className || ''}`}>
                    {renderCellContent(column, row, index)}
                  </TableCell>
                ))}
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
      {hasMoreData && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleShowMore}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
