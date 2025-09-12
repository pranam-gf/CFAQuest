import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getProviderInfo } from "@/lib/provider-mapping";
import { ProviderLogo } from "@/components/provider-logo";

// Provider options based on actual supported providers from provider-mapping.tsx
const PROVIDER_OPTIONS = [
  { value: "Alibaba", label: "Alibaba" },
  { value: "Anthropic", label: "Anthropic" },
  { value: "DeepSeek", label: "DeepSeek" },
  { value: "Google", label: "Google" },
  { value: "Meta", label: "Meta" },
  { value: "Mistral", label: "Mistral" },
  { value: "Moonshot AI", label: "Moonshot AI" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "Writer", label: "Writer" },
  { value: "xAI", label: "xAI" }
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
    'Moonshot AI': 'kimi-k2',
    'Alibaba': 'qwen3-32b',
    'Cohere': 'command-r-plus',
    'Groq': 'groq-llama3.3-70b',
  };
  
  return providerToModelMap[providerName] || 'unknown-model';
};

// Model Type options
const MODEL_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Reasoning", label: "Reasoning" },
  { value: "Non-Reasoning", label: "Non-Reasoning" }
];

// Strategy options
const STRATEGY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "CoT", label: "Chain of Thought" },
  { value: "Direct", label: "Direct" }
];

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
    if (selectedProviders.length === 0) return "AI Provider";
    if (selectedProviders.length === 1) return selectedProviders[0];
    return `${selectedProviders.length} providers`;
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 text-sm bg-white/80 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
            </div>
            <ScrollArea>
              <div className="px-2">
                {filteredProviders.map(provider => {
                  const providerInfo = getProviderInfo(provider.value);
                  const isSelected = selectedProviders.includes(provider.value);
                  return (
                    <div
                      key={provider.value}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer ${
                        isSelected ? 'bg-gray-100/30 dark:bg-gray-700/30' : ''
                      }`}
                      onClick={() => onSelectProvider(provider.value)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectProvider(provider.value)}
                        className="h-4 w-4"
                      />
                      <div className="flex items-center gap-2 flex-grow">
                         <ProviderLogo modelName={getModelNameForProvider(provider.value)} size="sm" />
                         <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{provider.label}</span>
                       </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModelTypeSelectionDropdownProps {
  selectedModelType: string;
  onSelectModelType: (modelType: string) => void;
}

interface StrategySelectionDropdownProps {
  selectedStrategy: string;
  onSelectStrategy: (strategy: string) => void;
}

interface StrategyMultiSelectionDropdownProps {
  selectedStrategies: string[];
  onSelectStrategy: (strategyId: string) => void;
}

function ModelTypeSelectionDropdown({ selectedModelType, onSelectModelType }: ModelTypeSelectionDropdownProps) {
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

  const filteredModelTypes = MODEL_TYPE_OPTIONS;

  const getSelectedText = () => {
    const selected = MODEL_TYPE_OPTIONS.find(option => option.value === selectedModelType);
    return selected ? selected.label : "Model Type";
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
          >

            <ScrollArea>
              <div className="px-2">
                {filteredModelTypes.map(modelType => (
                  <div
                    key={modelType.value}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => {
                      onSelectModelType(modelType.value);
                      setIsOpen(false);
                    }}
                  >
                    <Checkbox
                      checked={selectedModelType === modelType.value}
                      onCheckedChange={() => {
                        onSelectModelType(modelType.value);
                        setIsOpen(false);
                      }}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{modelType.label}</span>
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

function StrategySelectionDropdown({ selectedStrategy, onSelectStrategy }: StrategySelectionDropdownProps) {
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

  const filteredStrategies = STRATEGY_OPTIONS;

  const getSelectedText = () => {
    const selected = STRATEGY_OPTIONS.find(option => option.value === selectedStrategy);
    return selected ? selected.label : "Strategy";
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
          >

            <ScrollArea>
              <div className="px-2">
                {filteredStrategies.map(strategy => (
                  <div
                    key={strategy.value}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => {
                      onSelectStrategy(strategy.value);
                      setIsOpen(false);
                    }}
                  >
                    <Checkbox
                      checked={selectedStrategy === strategy.value}
                      onCheckedChange={() => {
                        onSelectStrategy(strategy.value);
                        setIsOpen(false);
                      }}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{strategy.label}</span>
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

function StrategyMultiSelectionDropdown({ selectedStrategies, onSelectStrategy }: StrategyMultiSelectionDropdownProps) {
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

  const filteredStrategies = STRATEGY_OPTIONS;

  const getSelectedText = () => {
    if (selectedStrategies.length === 0) return "Strategy";
    if (selectedStrategies.length === 1) {
      const strategy = STRATEGY_OPTIONS.find(s => s.value === selectedStrategies[0]);
      return strategy ? strategy.label : selectedStrategies[0];
    }
    return `${selectedStrategies.length} strategies`;
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
          >
            <ScrollArea>
              <div className="p-2">
                {filteredStrategies.map(strategy => (
                  <div
                    key={strategy.value}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => onSelectStrategy(strategy.value)}
                  >
                    <Checkbox
                      checked={selectedStrategies.includes(strategy.value)}
                      onCheckedChange={() => onSelectStrategy(strategy.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{strategy.label}</span>
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
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
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
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
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
  { value: "overall", label: "Overall Results" },
  { value: "mcq", label: "MCQ Results" },
  { value: "essay", label: "Essay Results" },
];

interface ViewFilterDropdownProps {
  selectedView: string;
  onSelectView: (view: string) => void;
}

function ViewFilterDropdown({ selectedView, onSelectView }: ViewFilterDropdownProps) {
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
    const selected = VIEW_TYPE_OPTIONS.find(option => option.value === selectedView);
    return selected ? selected.label : "View Type";
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full bg-slate-50/50 dark:bg-slate-700/20 border-slate-300 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100/70 dark:hover:bg-slate-700/30 text-slate-700 dark:text-gray-200 shadow-sm flex items-center justify-between"
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
            className="absolute z-50 mt-1 min-w-max left-0 origin-top rounded-xl bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-2xl"
          >
            <ScrollArea>
              <div className="px-2">
                {VIEW_TYPE_OPTIONS.map(viewType => (
                  <div
                    key={viewType.value}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => {
                      onSelectView(viewType.value);
                      setIsOpen(false);
                    }}
                  >
                    <Checkbox
                      checked={selectedView === viewType.value}
                      onCheckedChange={() => {
                        onSelectView(viewType.value);
                        setIsOpen(false);
                      }}
                      className="h-4 w-4"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{viewType.label}</span>
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

interface FilterTagProps {
  label: string;
  onRemove: () => void;
  icon?: React.ReactNode;
}

function FilterTag({ label, onRemove, icon }: FilterTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 20 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-transparent text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-700"
    >
      {icon && (
        <span className="flex items-center bg-white dark:bg-gray-800 rounded-full p-0.5">
          {icon}
        </span>
      )}
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  );
}

interface ActiveFiltersProps {
  providerFilter: string | string[];
  onRemoveProvider: (provider: string) => void;
  
  contextLengthFilter: string | string[];
  onRemoveContextLength: (contextLength: string) => void;
  
  modelTypeFilter?: string;
  onRemoveModelType?: () => void;
  
  strategyFilter?: string | string[];
  onRemoveStrategy?: (strategy: string) => void;
  
  viewFilter?: string;
  onRemoveView?: () => void;
}

function ActiveFilters({
  providerFilter,
  onRemoveProvider,
  contextLengthFilter,
  onRemoveContextLength,
  modelTypeFilter,
  onRemoveModelType,
  strategyFilter,
  onRemoveStrategy,
  viewFilter,
  onRemoveView,
}: ActiveFiltersProps) {
  const activeProviders = Array.isArray(providerFilter) ? providerFilter.filter(v => v !== 'all') : (providerFilter && providerFilter !== 'all' ? [providerFilter] : []);
  const activeContextLengths = Array.isArray(contextLengthFilter) ? contextLengthFilter.filter(v => v !== 'all') : (contextLengthFilter && contextLengthFilter !== 'all' ? [contextLengthFilter] : []);
  const activeStrategies = Array.isArray(strategyFilter) ? strategyFilter.filter(v => v !== 'all') : (strategyFilter && strategyFilter !== 'all' ? [strategyFilter] : []);

  const hasActiveFilters = activeProviders.length > 0 || 
                          activeContextLengths.length > 0 || 
                          (modelTypeFilter && modelTypeFilter !== 'all') ||
                          activeStrategies.length > 0 ||
                          (viewFilter && viewFilter !== 'overall');

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
      <AnimatePresence>
        {/* Provider filter tags */}
        {activeProviders.map(provider => {
          const modelName = getModelNameForProvider(provider);
          return (
            <FilterTag
              key={`provider-${provider}`}
              label={provider}
              icon={<ProviderLogo modelName={modelName} size="xs" />}
              onRemove={() => onRemoveProvider(provider)}
            />
          );
        })}
        
        {/* Context length filter tags */}
        {activeContextLengths.map(contextLength => {
          const option = CONTEXT_LENGTH_OPTIONS.find(opt => opt.value === contextLength);
          return (
            <FilterTag
              key={`context-${contextLength}`}
              label={option?.label || contextLength}
              onRemove={() => onRemoveContextLength(contextLength)}
            />
          );
        })}
        
        {/* Model type filter tag */}
        {modelTypeFilter && modelTypeFilter !== 'all' && onRemoveModelType && (
          <FilterTag
            key="model-type"
            label={MODEL_TYPE_OPTIONS.find(opt => opt.value === modelTypeFilter)?.label || modelTypeFilter}
            onRemove={onRemoveModelType}
          />
        )}
        
        {/* Strategy filter tags */}
        {activeStrategies.map(strategy => {
          const option = STRATEGY_OPTIONS.find(opt => opt.value === strategy);
          return (
            <FilterTag
              key={`strategy-${strategy}`}
              label={option?.label || strategy}
              onRemove={() => onRemoveStrategy?.(strategy)}
            />
          );
        })}
        
        {/* View filter tag */}
        {viewFilter && viewFilter !== 'overall' && onRemoveView && (
          <FilterTag
            key="view"
            label={VIEW_TYPE_OPTIONS.find(opt => opt.value === viewFilter)?.label || viewFilter}
            onRemove={onRemoveView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface GlobalFiltersProps {
  // Provider filter (now supports multi-select)
  providerFilter: string | string[];
  onProviderFilterChange: (value: string | string[]) => void;
  
  // Context length filter (now supports multi-select)
  contextLengthFilter: string | string[];
  onContextLengthFilterChange: (value: string | string[]) => void;
  
  // Model type filter
  modelTypeFilter?: string;
  onModelTypeFilterChange?: (value: string) => void;
  
  // Strategy filter
  strategyFilter?: string | string[];
  onStrategyFilterChange?: (value: string | string[]) => void;
  
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
  modelTypeFilter,
  onModelTypeFilterChange,
  strategyFilter,
  onStrategyFilterChange,
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

  // Handler functions for removing filters
  const handleRemoveProvider = (provider: string) => {
    const currentProviders = Array.isArray(providerFilter) ? providerFilter.filter(v => v !== 'all') : (providerFilter && providerFilter !== 'all' ? [providerFilter] : []);
    const updatedProviders = currentProviders.filter(id => id !== provider);
    onProviderFilterChange(updatedProviders);
  };

  const handleRemoveContextLength = (contextLength: string) => {
    const currentContextLengths = Array.isArray(contextLengthFilter) ? contextLengthFilter.filter(v => v !== 'all') : (contextLengthFilter && contextLengthFilter !== 'all' ? [contextLengthFilter] : []);
    const updatedContextLengths = currentContextLengths.filter(id => id !== contextLength);
    onContextLengthFilterChange(updatedContextLengths);
  };

  const handleRemoveModelType = () => {
    onModelTypeFilterChange?.('all');
  };

  const handleRemoveStrategy = (strategy: string) => {
    if (Array.isArray(strategyFilter)) {
      const currentStrategies = strategyFilter.filter(v => v !== 'all');
      const updatedStrategies = currentStrategies.filter(id => id !== strategy);
      onStrategyFilterChange?.(updatedStrategies);
    } else {
      onStrategyFilterChange?.('all');
    }
  };

  const handleRemoveView = () => {
    onViewFilterChange?.('overall');
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 flex-1">
        {/* View Filter */}
        {viewFilter && onViewFilterChange && (
          <ViewFilterDropdown
            selectedView={viewFilter}
            onSelectView={onViewFilterChange}
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

        {/* Model Type Filter */}
        {modelTypeFilter !== undefined && onModelTypeFilterChange && (
          <ModelTypeSelectionDropdown
            selectedModelType={modelTypeFilter}
            onSelectModelType={onModelTypeFilterChange}
          />
        )}

        {/* Strategy Filter */}
        {strategyFilter !== undefined && onStrategyFilterChange && (
          Array.isArray(strategyFilter) ? (
            <StrategyMultiSelectionDropdown
              selectedStrategies={strategyFilter.filter(v => v !== 'all')}
              onSelectStrategy={(strategyId) => {
                const currentStrategies = strategyFilter.filter(v => v !== 'all');
                const updatedStrategies = currentStrategies.includes(strategyId)
                  ? currentStrategies.filter(id => id !== strategyId)
                  : [...currentStrategies, strategyId];
                onStrategyFilterChange(updatedStrategies);
              }}
            />
          ) : (
            <StrategySelectionDropdown
              selectedStrategy={strategyFilter}
              onSelectStrategy={onStrategyFilterChange}
            />
          )
        )}

        {/* Additional Filters */}
        {additionalFilters}

        {/* Column Visibility Dropdown - Custom dropdown with search */}
        <ColumnSelectionDropdown
          availableColumns={availableColumns}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
        />
      </div>

      {/* Active Filters Tags */}
      <ActiveFilters
        providerFilter={providerFilter}
        onRemoveProvider={handleRemoveProvider}
        contextLengthFilter={contextLengthFilter}
        onRemoveContextLength={handleRemoveContextLength}
        modelTypeFilter={modelTypeFilter}
        onRemoveModelType={handleRemoveModelType}
        strategyFilter={strategyFilter}
        onRemoveStrategy={handleRemoveStrategy}
        viewFilter={viewFilter}
        onRemoveView={handleRemoveView}
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