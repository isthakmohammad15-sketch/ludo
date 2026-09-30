import React, { useState } from 'react';
import { Volume2, Music, Zap, Clock, Palette, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { sound } from '../game/sound';

export default function Settings({
  settings = {},
  onUpdateSettings,
}) {
  const [sfx, setSfx] = useState(sound.sfxEnabled);
  const [music, setMusic] = useState(sound.musicEnabled);
  const [volume, setVolume] = useState(sound.volume * 100);
  const [speed, setSpeed] = useState('normal');
  const [timerDuration, setTimerDuration] = useState(20);
  const [boardTheme, setBoardTheme] = useState('classic');
  const [savedToast, setSavedToast] = useState(false);

  const handleToggleSfx = (val) => {
    sound.setSfxEnabled(val);
    setSfx(val);
    sound.playClick();
  };

  const handleToggleMusic = (val) => {
    sound.setMusicEnabled(val);
    setMusic(val);
    sound.playClick();
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    sound.setVolume(val / 100);
  };

  const handleSave = () => {
    sound.playClick();
    if (onUpdateSettings) {
      onUpdateSettings({ sfx, music, speed, timerDuration, boardTheme });
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset local stats and game preferences?')) {
      sound.playClick();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Arena Settings</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Customize audio, token mechanics, visual themes, and match rules
        </p>
      </div>

      <div className="space-y-4">
        {/* Audio Settings Card */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel-elevated border border-slate-800 space-y-5">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <span>Audio & Soundtracks</span>
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* SFX Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Sound Effects</span>
                <span className="text-slate-400 text-xs">Procedural dice roll, captures, steps & fanfare</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSfx(!sfx)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                  sfx ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
              </button>
            </div>

            {/* Ambient Music Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Ambient Synthesizer Music</span>
                <span className="text-slate-400 text-xs">Soothing procedural background harmony</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleMusic(!music)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                  music ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-200">Master Volume</span>
                <span className="text-purple-300 font-mono font-bold">{Math.round(volume)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Gameplay & Speed Card */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel-elevated border border-slate-800 space-y-5">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Gameplay & Motion</span>
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Animation Speed */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-200 block">Token Movement Speed</span>
                <span className="text-slate-400 text-xs">Pacing for step-by-step animations</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: 'normal', label: 'Classic' },
                  { id: 'fast', label: 'Turbo (Fast)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSpeed(s.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      speed === s.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Turn Timer Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-200 block">Turn Timer Limit</span>
                <span className="text-slate-400 text-xs">Seconds allocated before auto-pass</span>
              </div>
              <div className="flex items-center gap-2">
                {[15, 20, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimerDuration(t);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      timerDuration === t
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Board Visual Theme */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel-elevated border border-slate-800 space-y-5">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Arena Aesthetics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'classic', name: 'Cyber Dark', desc: 'Deep navy #080B14 with neon glow' },
              { id: 'velvet', name: 'Royal Velvet', desc: 'Midnight obsidian with rich jewel tones' },
              { id: 'emerald', name: 'Emerald Citadel', desc: 'Sci-fi arena with high contrast paths' },
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setBoardTheme(theme.id);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  boardTheme === theme.id
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-200">{theme.name}</span>
                  {boardTheme === theme.id && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-400">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Save button & Danger Zone */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedToast ? <Check className="w-4 h-4" /> : null}
            <span>{savedToast ? 'Settings Saved!' : 'Save Preferences'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Local Stats & Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
