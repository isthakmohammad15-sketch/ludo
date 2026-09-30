import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { COLOR_THEMES } from '../game/players';
import { sound } from '../game/sound';

export default function WinnerModal({
  winner,
  players = [],
  onRestart,
  onExit,
}) {
  if (!winner) return null;

  const theme = COLOR_THEMES[winner.color] || COLOR_THEMES.red;

  useEffect(() => {
    // Launch celebratory confetti cascade
    try {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#EF4444', '#22C55E', '#FACC15', '#3B82F6', '#8B5CF6'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#EF4444', '#22C55E', '#FACC15', '#3B82F6', '#8B5CF6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      console.log('Confetti effect error', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel-elevated border-2 border-amber-400/60 shadow-2xl text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Crown */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-2 border-yellow-200 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 animate-bounce">
            {winner.avatar}
          </div>
          <Crown className="absolute -top-5 -right-3 w-10 h-10 text-amber-300 fill-amber-400 drop-shadow-md animate-pulse" />
        </div>

        {/* Title */}
        <div className="mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Victory Royale <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {winner.name} Wins!
          </h2>
          <p className={`text-sm font-semibold uppercase tracking-wider ${theme.textClass}`}>
            Master of the Arena
          </p>
        </div>

        {/* Match Statistics */}
        <div className="my-5 grid grid-cols-3 gap-2 bg-[#0C1222] p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Tokens Home</span>
            <span className="text-base font-extrabold text-emerald-400">4 / 4</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Captured</span>
            <span className="text-base font-extrabold text-purple-400">{winner.stats?.captured || 0}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Tokens Lost</span>
            <span className="text-base font-extrabold text-red-400">{winner.stats?.lost || 0}</span>
          </div>
        </div>

        {/* Final Standings */}
        <div className="mb-6 space-y-1.5 text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Match Standings
          </span>
          {players.map((p, idx) => {
            const isWin = p.id === winner.id;
            const homeCount = p.tokens.filter(t => t.step === 56).length;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                  isWin
                    ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">{idx + 1}.</span>
                  <span>{p.avatar}</span>
                  <span className="truncate max-w-[140px]">{p.name}</span>
                </div>
                <span className="font-semibold">
                  {homeCount}/4 Home
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-lg shadow-purple-600/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
