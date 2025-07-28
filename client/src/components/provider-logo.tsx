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

  return (
    <div className="flex items-center space-x-2">
      <div 
        className={`${sizeClasses[size]} flex-shrink-0`}
        style={{ color: provider.color }}
        dangerouslySetInnerHTML={{ __html: provider.logo }}
      />
      {showName && (
        <span className={`${textSizeClasses[size]} font-medium text-slate-900`}>
          {provider.name}
        </span>
      )}
    </div>
  );
}