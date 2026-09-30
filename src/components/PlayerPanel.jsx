import React from 'react';
import { Bot, Crown, Shield, Trophy } from 'lucide-react';
import { COLOR_THEMES } from '../game/players';

export default function PlayerPanel({
  player,
  isActive = false,
  isClientTurn = false,
}) {
  if (!player) return null;

  const theme = COLOR_THEMES[player.color] || COLOR_THEMES.red;

  const inYard = player.tokens.filter(t => t.step === -1).length;
  const inHome = player.tokens.filter(t => t.step === 56).length;
  const onTrack = 4 - inYard - inHome;

  return (
    <div
      className={`
        relative rounded-xl p-2.5 sm:p-3 transition-all duration-300
        glass-card border
        ${
          isActive
            ? `${theme.borderClass} ${theme.glowClass} ring-2 ring-white/50 bg-[#162035]/90 scale-[1.02]`
            : 'border-slate-800/80 bg-[#101626]/70 opacity-80'
        }
      `}
    >
      {/* Active turn badge */}
      {isActive && (
        <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md animate-pulse">
          Active Turn
        </div>
      )}

      {/* Top row: Avatar, Name, Badges */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg bg-[#18233C] border ${theme.borderClass}`}>
          {player.avatar}
          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${theme.bgClass} border border-slate-900`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
              {player.name}
            </span>
            {player.isHost && (
              <Crown className="w-3 h-3 text-amber-400 shrink-0" title="Host" />
            )}
            {player.isBot && (
              <Bot className="w-3 h-3 text-cyan-400 shrink-0" title="AI Bot" />
            )}
          </div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textClass}`}>
            {theme.name}
          </span>
        </div>
      </div>

      {/* Token status chips */}
      <div className="grid grid-cols-3 gap-1 text-center bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/60 text-[10px]">
        <div>
          <span className="text-slate-400 block text-[9px]">Base</span>
          <span className="font-bold text-slate-200">{inYard}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px]">Track</span>
          <span className="font-bold text-slate-200">{onTrack}</span>
        </div>
        <div>
          <span className="text-emerald-400 block text-[9px]">Home</span>
          <span className="font-bold text-emerald-300">{inHome}/4</span>
        </div>
      </div>

      {/* Home Progress Bar */}
      <div className="mt-2 w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className={`h-full ${theme.bgClass} transition-all duration-500`}
          style={{ width: `${(inHome / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
