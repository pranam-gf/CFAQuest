import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
  minWidth?: number;
  maxDisplayItems?: number;
}

export function MultiSelectDropdown({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  className,
  triggerClassName,
  contentClassName,
  icon,
  minWidth = 120,
  maxDisplayItems = 2
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOptions = options.filter(option => value.includes(option.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    let newValue: string[];
    if (value.includes(optionValue)) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    onValueChange(newValue);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    }
    
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map(option => option.label).join(', ');
    }
    
    return `${selectedOptions.slice(0, maxDisplayItems).map(option => option.label).join(', ')} +${selectedOptions.length - maxDisplayItems}`;
  };

  const hasSelections = value.length > 0;

  return (
    <div 
      ref={dropdownRef} 
      className={cn("relative", className)}
    >
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200 bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/20 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
          triggerClassName
        )}
        whileTap={{ scale: 0.98 }}
        animate={{ 
          borderColor: isOpen ? 'rgba(59, 130, 246, 0.5)' : undefined,
          boxShadow: isOpen ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : undefined
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && (
            <div className="text-slate-600 dark:text-gray-300 flex-shrink-0">
              {icon}
            </div>
          )}
          <span className={cn(
            "text-slate-700 dark:text-gray-200 font-medium truncate",
            !hasSelections && "text-slate-500 dark:text-gray-400"
          )}>
            {getDisplayText()}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasSelections && (
            <motion.button
              type="button"
              onClick={clearAll}
              className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3 text-slate-500 dark:text-gray-400" />
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-slate-600 dark:text-gray-300" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut"
            }}
            className={cn(
              "absolute z-50 mt-1 rounded-md p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/60 dark:border-gray-700 shadow-xl",
              contentClassName
            )}
            style={{
              transformOrigin: "top center",
              width: '100%',
              minWidth: `${minWidth}px`
            }}
          >
            <div className="space-y-1 max-h-60 overflow-auto">
              <div className="mb-2 px-3 py-1">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {placeholder}
                </span>
              </div>
              <div ref={contentRef} className="space-y-1">
              {options.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isAllOption = option.value === 'all';
                
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-all duration-200 text-slate-700 dark:text-gray-200 font-medium hover:bg-white/60 dark:hover:bg-white/10 focus:bg-white/60 dark:focus:bg-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.15,
                      delay: index * 0.03,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
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
                );
              })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}