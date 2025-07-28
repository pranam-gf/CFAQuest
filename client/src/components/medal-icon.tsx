interface MedalIconProps {
  rank: number;
  className?: string;
}

export function MedalIcon({ rank, className = "w-5 h-5" }: MedalIconProps) {
  if (rank === 1) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="10" r="6" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
        <path d="M8 6L6 2L10 3L8 6Z" fill="#FFD700"/>
        <path d="M16 6L18 2L14 3L16 6Z" fill="#FFD700"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B8860B">1</text>
      </svg>
    );
  }
  
  if (rank === 2) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="10" r="6" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="1"/>
        <path d="M8 6L6 2L10 3L8 6Z" fill="#C0C0C0"/>
        <path d="M16 6L18 2L14 3L16 6Z" fill="#C0C0C0"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#696969">2</text>
      </svg>
    );
  }
  
  if (rank === 3) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="10" r="6" fill="#CD7F32" stroke="#B8860B" strokeWidth="1"/>
        <path d="M8 6L6 2L10 3L8 6Z" fill="#CD7F32"/>
        <path d="M16 6L18 2L14 3L16 6Z" fill="#CD7F32"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#8B4513">3</text>
      </svg>
    );
  }
  
  return (
    <span className={`flex items-center justify-center text-xs font-bold text-slate-600 ${className}`}>
      {rank}
    </span>
  );
}