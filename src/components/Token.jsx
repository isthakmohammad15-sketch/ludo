import React from 'react';

const COLOR_STYLES = {
  red: {
    gradient: 'from-red-500 via-red-600 to-red-800',
    ring: 'ring-red-400',
    shadow: 'shadow-red-500/50',
    glow: '0 0 16px rgba(239, 68, 68, 0.8)',
    border: 'border-red-300',
    inner: 'bg-red-400',
  },
  green: {
    gradient: 'from-emerald-400 via-emerald-600 to-emerald-800',
    ring: 'ring-emerald-400',
    shadow: 'shadow-emerald-500/50',
    glow: '0 0 16px rgba(34, 197, 94, 0.8)',
    border: 'border-emerald-300',
    inner: 'bg-emerald-400',
  },
  yellow: {
    gradient: 'from-amber-300 via-yellow-500 to-amber-700',
    ring: 'ring-yellow-300',
    shadow: 'shadow-yellow-500/50',
    glow: '0 0 16px rgba(250, 204, 21, 0.8)',
    border: 'border-yellow-200',
    inner: 'bg-amber-300',
  },
  blue: {
    gradient: 'from-blue-400 via-blue-600 to-blue-800',
    ring: 'ring-blue-400',
    shadow: 'shadow-blue-500/50',
    glow: '0 0 16px rgba(59, 130, 246, 0.8)',
    border: 'border-blue-300',
    inner: 'bg-blue-400',
  },
};

export default function Token({
  color = 'red',
  tokenId,
  isMovable = false,
  onClick,
  stackIndex = 0,
  stackCount = 1,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const style = COLOR_STYLES[color] || COLOR_STYLES.red;

  const sizeClasses = {
    sm: 'w-5 h-5 sm:w-6 sm:h-6',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
  }[size] || 'w-6 h-6 sm:w-8 sm:h-8';

  // If stacked on the same square, apply small offset
  const offsetStyle = stackCount > 1 ? {
    transform: `translate(${stackIndex * 3 - (stackCount - 1) * 1.5}px, ${stackIndex * 3 - (stackCount - 1) * 1.5}px)`,
    zIndex: 10 + stackIndex,
  } : {
    zIndex: 10,
  };

  return (
    <button
      type="button"
      onClick={isMovable ? onClick : undefined}
      disabled={!isMovable}
      style={{
        ...offsetStyle,
        boxShadow: isMovable ? style.glow : '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
      }}
      className={`
        relative rounded-full flex items-center justify-center
        transition-all duration-200
        ${sizeClasses}
        bg-gradient-to-b ${style.gradient}
        border-2 ${style.border}
        ${isMovable ? 'cursor-pointer animate-token-bounce hover:scale-110 ring-2 ' + style.ring : 'cursor-default'}
      `}
      title={`${color.toUpperCase()} Token ${tokenId + 1}${isMovable ? ' (Click to move)' : ''}`}
    >
      {/* 3D Glossy Dome reflection */}
      <span className="absolute top-0.5 left-1 w-2/5 h-2/5 rounded-full bg-white/60 blur-[0.5px] pointer-events-none" />

      {/* Center jewel / pin core */}
      <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${style.inner} border border-white/40 shadow-inner flex items-center justify-center`}>
        {stackCount > 1 && stackIndex === stackCount - 1 && (
          <span className="text-[9px] font-black text-white leading-none">
            {stackCount}
          </span>
        )}
      </span>

      {/* Selectable ripple indicator ring */}
      {isMovable && (
        <span className="absolute -inset-1 rounded-full border-2 border-white/80 animate-ping opacity-60 pointer-events-none" />
      )}
    </button>
  );
}
