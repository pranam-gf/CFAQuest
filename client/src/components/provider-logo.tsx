import React from 'react';
import { getProviderInfo } from "@/lib/provider-mapping";

interface ProviderLogoProps {
  modelName: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function ProviderLogo({ modelName, size = "md", showName = false }: ProviderLogoProps) {
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

  const logoProps = {
    className: `${sizeClasses[size]} flex-shrink-0`,
    style: { color: provider.color },
  };

  return (
    <div className="flex items-center space-x-2">
      {typeof Logo === 'function' ? (
        <Logo {...logoProps} />
      ) : (
        React.cloneElement(Logo, logoProps)
      )}
      {showName && (
        <span className={`${textSizeClasses[size]} font-medium text-slate-900`}>
          {provider.name}
        </span>
      )}
    </div>
  );
}