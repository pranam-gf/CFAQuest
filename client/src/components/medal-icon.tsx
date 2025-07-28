import React from 'react';

// --- Reusable SVG Medal Component ---

interface MedalSvgProps {
  className?: string;
  circleFill: string;
  strokeColor: string;
  pathFill: string;
  textColor: string;
  rank: number;
}

const MedalSvg: React.FC<MedalSvgProps> = ({ 
  className, 
  circleFill, 
  strokeColor, 
  pathFill, 
  textColor, 
  rank 
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="10" r="6" fill={circleFill} stroke={strokeColor} strokeWidth="1"/>
    <path d="M8 6L6 2L10 3L8 6Z" fill={pathFill}/>
    <path d="M16 6L18 2L14 3L16 6Z" fill={pathFill}/>
    <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill={textColor}>
      {rank}
    </text>
  </svg>
);

// --- Style Mapping for Medals ---

const medalStyles: { [key: number]: Omit<MedalSvgProps, 'rank' | 'className'> } = {
  1: { // Gold
    circleFill: "#FFD700",
    strokeColor: "#FFA500",
    pathFill: "#FFD700",
    textColor: "#B8860B",
  },
  2: { // Silver
    circleFill: "#C0C0C0",
    strokeColor: "#A9A9A9",
    pathFill: "#C0C0C0",
    textColor: "#696969",
  },
  3: { // Bronze
    circleFill: "#CD7F32",
    strokeColor: "#B8860B",
    pathFill: "#CD7F32",
    textColor: "#8B4513",
  },
};

// --- Main MedalIcon Component ---

interface MedalIconProps {
  rank: number;
  className?: string;
}

export function MedalIcon({ rank, className = "w-5 h-5" }: MedalIconProps) {
  const styles = medalStyles[rank];

  if (styles) {
    return <MedalSvg {...styles} rank={rank} className={className} />;
  }
  
  // Fallback for ranks other than 1, 2, 3
  return (
    <span className={`flex items-center justify-center text-xs font-bold text-slate-600 ${className}`}>
      {rank}
    </span>
  );
}