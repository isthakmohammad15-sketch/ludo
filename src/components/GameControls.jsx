import React from 'react';
import { Volume2, VolumeX, Music, BookOpen, RotateCcw, LogOut, Zap, FastForward } from 'lucide-react';
import { sound } from '../game/sound';

export default function GameControls({
  sfxEnabled = true,
  musicEnabled = false,
  speed = 'normal',
  onToggleSfx,
  onToggleMusic,
  onToggleSpeed,
  onOpenRules,
  onRestart,
  onLeave,
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-center p-2 rounded-2xl glass-card border border-slate-800">
      {/* SFX Toggle */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onToggleSfx();
        }}
        title={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
          sfxEnabled ? 'bg-slate-800 text-purple-400 hover:bg-slate-700' : 'bg-slate-900 text-slate-500 hover:text-slate-400'
        }`}
      >
        {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span className="hidden sm:inline font-semibold">SFX</span>
      </button>

      {/* Ambient Music Toggle */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onToggleMusic();
        }}
        title={musicEnabled ? 'Stop Music' : 'Play Music'}
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
          musicEnabled ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Music className={`w-4 h-4 ${musicEnabled ? 'animate-pulse text-purple-400' : ''}`} />
        <span className="hidden sm:inline font-semibold">Music</span>
      </button>

      {/* Speed Toggle */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onToggleSpeed();
        }}
        title="Toggle Token Speed"
        className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
          speed === 'fast' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        {speed === 'fast' ? <Zap className="w-4 h-4 text-amber-400" /> : <FastForward className="w-4 h-4" />}
        <span className="hidden sm:inline font-semibold">{speed === 'fast' ? 'Turbo' : 'Normal'}</span>
      </button>

      {/* Rules Guide */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onOpenRules();
        }}
        title="View Game Rules"
        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <BookOpen className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline font-semibold">Rules</span>
      </button>

      {/* Restart */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Are you sure you want to restart this match?')) {
            sound.playClick();
            onRestart();
          }
        }}
        title="Restart Match"
        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline font-semibold">Restart</span>
      </button>

      {/* Leave */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Do you want to leave the game and return to the main menu?')) {
            sound.playClick();
            onLeave();
          }
        }}
        title="Leave Game"
        className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/40 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline font-semibold">Exit</span>
      </button>
    </div>
  );
}
