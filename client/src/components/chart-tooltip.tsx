import React from 'react';
import { getProviderInfo } from "@/lib/provider-mapping";
import { getDisplayName } from "@/lib/model-display-names";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  
  // Try to determine the model name from various possible fields
  const getModelName = (): string | null => {
    // Check common model field names
    if (data.fullModel) return data.fullModel; // Original model ID - best for logo lookup
    if (data.model) return data.model;
    if (label && typeof label === 'string' && label !== data.provider) return label;
    return null;
  };

  // Try to determine the provider name
  const getProviderName = (): string | null => {
    if (data.provider) return data.provider;
    const modelName = getModelName();
    if (modelName) return getProviderInfo(modelName).name;
    if (label && typeof label === 'string') return getProviderInfo(label).name;
    return null;
  };

  const modelName = getModelName();
  const providerName = getProviderName();
  const displayName = modelName ? getDisplayName(modelName) : (data.provider || label);

  // Determine if we should show provider logo
  const shouldShowLogo = modelName || (providerName && providerName !== 'Unknown');
  const logoModel = data.fullModel || modelName || data.provider || label || '';
  
  // Helper function to determine if logo should be inverted in dark mode
  const getDarkModeLogoClass = (model: string): string => {
    // If model is a provider name, use it directly
    const provider = data.provider || getProviderInfo(model).name;
    const darkLogos = ['Writer', 'xAI', 'Anthropic', 'OpenAI'];
    return darkLogos.includes(provider) ? 'dark:invert dark:brightness-0' : '';
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 shadow-xl">
      <div className="space-y-2">
        {/* Header with logo and name */}
        {(shouldShowLogo || displayName) && (
          <div className="flex items-center gap-2 mb-2">
            {shouldShowLogo && getProviderInfo(logoModel).logo && (
              <span className="inline-flex items-center w-4 h-4 flex-shrink-0">
                {(() => {
                  const LogoComponent = getProviderInfo(logoModel).logo;
                  const darkModeClass = getDarkModeLogoClass(logoModel);
                  return typeof LogoComponent === 'function'
                    ? <LogoComponent className={`w-4 h-4 flex-shrink-0 ${darkModeClass}`} style={{ width: '16px', height: '16px' }} />
                    : LogoComponent;
                })()}
              </span>
            )}
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {displayName}
            </span>
          </div>
        )}
        
        {/* Data values */}
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {entry.name || entry.dataKey}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {formatValue(entry.value, entry.dataKey, entry.name)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format values based on the data key
function formatValue(value: any, dataKey?: string, name?: string): string {
  if (typeof value !== 'number') {
    return String(value);
  }

  const key = (dataKey || name || '').toLowerCase();
  
  // Accuracy/percentage values
  if (key.includes('accuracy') || key.includes('percentage') || key === 'y') {
    return `${value.toFixed(1)}%`;
  }
  
  // Price/cost values
  if (key.includes('price') || key.includes('cost') || key.includes('efficiency') || key === 'x') {
    return `$${value.toFixed(2)}`;
  }
  
  // Default numeric formatting
  return value.toFixed(2);
}

// Specific variant for scatter charts that need x,y coordinate handling
export function ScatterChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const modelName = data.model || data.fullModel;
  const displayName = modelName ? getDisplayName(modelName) : 'Unknown Model';

  // Helper function to determine if logo should be inverted in dark mode
  const getDarkModeLogoClass = (model: string): string => {
    const provider = getProviderInfo(model).name;
    const darkLogos = ['Writer', 'xAI', 'Anthropic', 'OpenAI'];
    return darkLogos.includes(provider) ? 'dark:invert dark:brightness-0' : '';
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {modelName && getProviderInfo(modelName).logo && (
            <span className="inline-flex items-center w-4 h-4 flex-shrink-0">
              {(() => {
                const LogoComponent = getProviderInfo(modelName).logo;
                const darkModeClass = getDarkModeLogoClass(modelName);
                return typeof LogoComponent === 'function'
                  ? <LogoComponent className={`w-4 h-4 flex-shrink-0 ${darkModeClass}`} style={{ width: '16px', height: '16px' }} />
                  : LogoComponent;
              })()}
            </span>
          )}
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {displayName}
          </span>
        </div>
        
        <div className="space-y-1">
          {/* X-axis value */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {data.x !== undefined ? (typeof data.x === 'number' && data.x < 1 ? 'Cost' : 'Price') : 'X'}
            </span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {data.x !== undefined ? `$${Number(data.x).toFixed(data.x < 1 ? 4 : 2)}` : 'N/A'}
            </span>
          </div>
          
          {/* Y-axis value */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {data.y !== undefined ? 'Accuracy' : 'Y'}
            </span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {data.y !== undefined ? `${Number(data.y).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}