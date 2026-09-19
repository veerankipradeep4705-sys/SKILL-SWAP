import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const SkillSwapLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', title: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 'w-20 h-20', title: 'text-3xl', sub: 'text-base' },
  };

  const current = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center select-none text-center">
      {/* Handcrafted SVG matching the two-figure heart/interlocking hands loop from mockups */}
      <div className={`${current.icon} relative flex items-center justify-center mb-1.5`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Head dots */}
          <circle cx="34" cy="22" r="7" fill={inverted ? '#FFFFFF' : '#4F46E5'} />
          <circle cx="66" cy="22" r="7" fill={inverted ? '#FFFFFF' : '#6366F1'} />
          
          {/* Interlocking body wings / curved heart gesture */}
          <path
            d="M 22,38 C 14,54 22,76 46,74 C 40,68 34,56 38,46 C 41,38 48,34 50,44 C 52,34 59,38 62,46 C 66,56 60,68 54,74 C 78,76 86,54 78,38 C 72,50 64,52 57,48 C 50,44 50,44 43,48 C 36,52 28,50 22,38 Z"
            fill={inverted ? '#FFFFFF' : '#4F46E5'}
          />
          <path
            d="M 40,70 C 47,78 53,78 60,70 C 56,73 44,73 40,70 Z"
            fill={inverted ? '#E0E7FF' : '#818CF8'}
          />
        </svg>
      </div>

      <div className="flex flex-col items-center leading-tight">
        <span
          className={`font-extrabold tracking-wider ${current.title} ${
            inverted ? 'text-white' : 'text-slate-900'
          }`}
        >
          SKILL SWAP
        </span>
        {showSubtitle && (
          <span
            className={`font-medium tracking-wide ${current.sub} ${
              inverted ? 'text-indigo-100' : 'text-indigo-600'
            }`}
          >
            Learn by Teaching
          </span>
        )}
      </div>
    </div>
  );
};
