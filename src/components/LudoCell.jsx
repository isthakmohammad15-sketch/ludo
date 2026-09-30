import React from 'react';
import { Star } from 'lucide-react';
import Token from './Token';

export default function LudoCell({
  r,
  c,
  isSafe = false,
  safeColor = null,
  isStart = false,
  startColor = null,
  homeStretchColor = null,
  tokensHere = [],
  movableTokenIds = [],
  activePlayerColor = null,
  onTokenClick,
}) {
  // Cell background color logic
  let bgClasses = 'bg-[#151D30] border-[#222E4A]';
  let indicator = null;

  if (homeStretchColor) {
    switch (homeStretchColor) {
      case 'red':
        bgClasses = 'bg-red-600/30 border-red-500/50';
        break;
      case 'green':
        bgClasses = 'bg-emerald-600/30 border-emerald-500/50';
        break;
      case 'yellow':
        bgClasses = 'bg-amber-500/30 border-amber-400/50';
        break;
      case 'blue':
        bgClasses = 'bg-blue-600/30 border-blue-500/50';
        break;
      default:
        break;
    }
  } else if (isStart && startColor) {
    switch (startColor) {
      case 'red':
        bgClasses = 'bg-red-600/40 border-red-500/70';
        indicator = <span className="text-red-400 text-[10px] sm:text-xs font-black">START</span>;
        break;
      case 'green':
        bgClasses = 'bg-emerald-600/40 border-emerald-500/70';
        indicator = <span className="text-emerald-400 text-[10px] sm:text-xs font-black">START</span>;
        break;
      case 'yellow':
        bgClasses = 'bg-amber-500/40 border-amber-400/70';
        indicator = <span className="text-amber-300 text-[10px] sm:text-xs font-black">START</span>;
        break;
      case 'blue':
        bgClasses = 'bg-blue-600/40 border-blue-500/70';
        indicator = <span className="text-blue-400 text-[10px] sm:text-xs font-black">START</span>;
        break;
      default:
        break;
    }
  }

  return (
    <div
      style={{
        gridRow: r + 1,
        gridColumn: c + 1,
      }}
      className={`
        relative border flex items-center justify-center
        transition-colors duration-150 select-none
        ${bgClasses}
      `}
    >
      {/* Safe Star Indicator */}
      {isSafe && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <Star className="w-3/5 h-3/5 text-slate-300 fill-slate-300/40" />
        </div>
      )}

      {/* Start text or arrow */}
      {indicator && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          {indicator}
        </div>
      )}

      {/* Render tokens on this cell */}
      {tokensHere.length > 0 && (
        <div className="relative w-full h-full flex items-center justify-center">
          {tokensHere.map((item, idx) => {
            const isMovable = item.playerColor === activePlayerColor && movableTokenIds.includes(item.tokenId);
            return (
              <Token
                key={`${item.playerColor}-${item.tokenId}`}
                color={item.playerColor}
                tokenId={item.tokenId}
                isMovable={isMovable}
                onClick={() => onTokenClick(item.tokenId)}
                stackIndex={idx}
                stackCount={tokensHere.length}
                size="sm"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
