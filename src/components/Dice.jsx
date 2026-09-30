import React, { useEffect } from 'react';
import { Dices, Sparkles, Timer } from 'lucide-react';
import { sound } from '../game/sound';

const PIP_LAYOUTS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const COLOR_GLOW = {
  red: 'border-red-500 shadow-red-500/50 from-red-600 to-red-900',
  green: 'border-emerald-500 shadow-emerald-500/50 from-emerald-600 to-emerald-900',
  yellow: 'border-amber-400 shadow-amber-400/50 from-amber-500 to-amber-800',
  blue: 'border-blue-500 shadow-blue-500/50 from-blue-600 to-blue-900',
};

export default function Dice({
  value = 6,
  isRolling = false,
  canRoll = false,
  onRoll,
  activeColor = 'red',
  playerName = 'Player',
  timer = 20,
  maxTimer = 20,
}) {
  const pips = PIP_LAYOUTS[value] || PIP_LAYOUTS[6];
  const glow = COLOR_GLOW[activeColor] || COLOR_GLOW.red;

  // Spacebar to roll shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && canRoll && !isRolling) {
        e.preventDefault();
        onRoll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canRoll, isRolling, onRoll]);

  const timerPercentage = Math.max(0, Math.min(100, (timer / maxTimer) * 100));

  return (
    <div className="flex flex-col items-center gap-3 p-3 sm:p-4 rounded-2xl glass-panel-elevated w-full max-w-[280px]">
      {/* Turn indicator & Timer */}
      <div className="w-full flex items-center justify-between text-xs font-semibold px-1">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Dices className="w-3.5 h-3.5 text-purple-400" />
          <span>{playerName}'s Turn</span>
        </span>
        <div className="flex items-center gap-1 text-slate-300">
          <Timer className={`w-3.5 h-3.5 ${timer <= 5 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
          <span className={timer <= 5 ? 'text-red-400 font-bold' : ''}>{timer}s</span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            timer <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* 3D Dice Display Box */}
      <div className="perspective-dice my-1">
        <button
          type="button"
          onClick={canRoll ? onRoll : undefined}
          disabled={!canRoll || isRolling}
          aria-label={`Dice showing ${value}`}
          className={`
            relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
            bg-gradient-to-br from-slate-800 to-slate-950
            border-2 ${canRoll ? 'border-white ring-4 ring-purple-500/50 shadow-xl cursor-pointer hover:scale-105 active:scale-95' : 'border-slate-700 opacity-90'}
            transition-transform duration-200 select-none
            flex items-center justify-center
            ${isRolling ? 'animate-dice-roll' : ''}
          `}
          style={{
            boxShadow: canRoll ? '0 10px 25px -5px rgba(139, 92, 246, 0.5)' : 'none',
          }}
        >
          {/* Subtle glossy sheen */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* 3x3 Grid of Pips */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 grid grid-cols-3 grid-rows-3 gap-1 place-items-center p-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => {
              const hasPip = pips.includes(idx);
              return (
                <div key={idx} className="w-full h-full flex items-center justify-center">
                  {hasPip && (
                    <div
                      className={`
                        w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full
                        ${value === 6 ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]'}
                        border border-black/20
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 6 Celebration Sparkle */}
          {value === 6 && !isRolling && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
              +1 ROLL!
            </span>
          )}
        </button>
      </div>

      {/* Roll Action Button */}
      <button
        type="button"
        onClick={canRoll ? onRoll : undefined}
        disabled={!canRoll || isRolling}
        className={`
          w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wider uppercase
          flex items-center justify-center gap-2
          transition-all duration-200
          ${
            canRoll
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-lg shadow-purple-600/40 hover:brightness-110 active:scale-98 cursor-pointer ring-1 ring-white/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }
        `}
      >
        <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
        <span>{isRolling ? 'Rolling...' : canRoll ? 'Roll Dice' : 'Wait Turn'}</span>
      </button>

      {/* Quick helper tip */}
      <p className="text-[11px] text-slate-400 text-center">
        {canRoll ? 'Click button or press Spacebar' : 'Rolling locked until next turn'}
      </p>
    </div>
  );
}
