import React from 'react';
import { getProviderInfo } from "@/lib/provider-mapping";

interface ProviderLogoProps {
  modelName: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export function ProviderLogo({ modelName, size = "md", showName = false, className }: ProviderLogoProps) {
  const provider = getProviderInfo(modelName);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const Logo = provider.logo;

  // Helper function to determine if logo should be inverted in dark mode
  const getDarkModeLogoClass = (providerName: string): string => {
    const darkLogos = ['Writer', 'xAI', 'Anthropic', 'OpenAI', 'Moonshot AI', 'Alibaba'];
    return darkLogos.includes(providerName) ? 'dark:invert' : '';
  };

  const logoProps = {
    className: `${sizeClasses[size]} flex-shrink-0 ${getDarkModeLogoClass(provider.name)} ${className || ''}`,
    style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' as const },
  };

  return (
    <div className="flex items-center space-x-2">
      {typeof Logo === 'function' ? (
        <Logo {...logoProps} />
      ) : (
        React.cloneElement(Logo, logoProps)
      )}
      {showName && (
        <span className={`${textSizeClasses[size]} font-medium text-slate-900 dark:text-white`}>
          {provider.name}
        </span>
      )}
    </div>
  );
}