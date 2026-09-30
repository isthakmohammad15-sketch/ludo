import React, { useState } from 'react';
import { Copy, Check, Shield, Dices, ArrowLeft, Users, Bot, Globe } from 'lucide-react';
import { sound } from '../game/sound';

export default function GameHeader({
  mode = 'ai',
  playerCount = 4,
  roomId = null,
  turnMessage = '',
  onLeave,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomId) return;
    navigator.clipboard?.writeText(roomId);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modeBadge = {
    ai: { label: 'Vs Computer', icon: Bot, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    local: { label: 'Pass & Play', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    online: { label: 'Online Room', icon: Globe, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  }[mode] || { label: 'Match', icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };

  const ModeIcon = modeBadge.icon;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-panel-elevated border border-slate-800">
      {/* Left: Back button & Mode Badge */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onLeave();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Return to Menu"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
            LUDO <span className="text-purple-400">ARENA</span>
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${modeBadge.color}`}>
          <ModeIcon className="w-3 h-3" />
          <span>{modeBadge.label} ({playerCount}P)</span>
        </div>
      </div>

      {/* Center: Live Action Ticker Banner */}
      <div className="flex-1 max-w-md w-full text-center px-2">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-200 font-medium shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate">{turnMessage || 'Match in progress...'}</span>
        </div>
      </div>

      {/* Right: Room ID with copy button (if multiplayer) */}
      {roomId && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold">Room:</span>
            <span className="font-mono font-bold text-purple-300 tracking-wider">{roomId}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-purple-400 hover:text-white transition-colors"
              title="Copy Room ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
