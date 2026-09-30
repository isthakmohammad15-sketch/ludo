import React from 'react';
import { X, ShieldCheck, Dice6, Swords, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl glass-panel-elevated border border-slate-700/80 p-5 sm:p-7 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Ludo Arena Rules</h2>
              <p className="text-xs text-slate-400">Standard International Tournament Rules</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Grid */}
        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
              <Dice6 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Entering the Board</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                All 4 tokens begin inside your Home Yard. You must roll a <strong className="text-white">6</strong> to bring a token out to your colored starting square.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Bonus Rolls</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                Rolling a <strong className="text-white">6</strong> gives you another roll! Capturing an opponent token or moving a token into the final Home also awards an immediate bonus roll.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Safe Star Cells</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                Cells marked with a <strong className="text-white">Star (⭐)</strong> and all 5 cells of your colored Home Stretch are Safe Zones. Tokens on safe cells cannot be captured.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Capturing Opponents</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                If your token lands on an opponent's token on a regular track cell, that opponent's token is captured and sent immediately back to their home yard!
              </p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Winning the Arena</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                Circumnavigate the board and guide all 4 tokens down your colored home stretch into the center. The first player to bring all 4 tokens home wins the match!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
