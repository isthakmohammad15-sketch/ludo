import React, { useState } from 'react';
import { User, Trophy, Award, Swords, Shield, Zap, Sparkles, Check, Edit2 } from 'lucide-react';
import { sound } from '../game/sound';

const AVATAR_OPTIONS = ['🦊', '🐉', '🦁', '🦅', '🐺', '🐯', '🐼', '🤖', '👑', '⚡'];

export default function Profile({
  userName: initialName = 'Alex Mercer',
  onUpdateUserName,
}) {
  const [userName, setUserName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');

  // Realistic profile statistics
  const stats = {
    level: 14,
    currentXp: 3450,
    nextLevelXp: 5000,
    gamesPlayed: 86,
    gamesWon: 53,
    winRate: 61.6,
    tokensCaptured: 194,
    tokensLost: 112,
    highestWinStreak: 7,
  };

  const xpPercent = Math.round((stats.currentXp / stats.nextLevelXp) * 100);

  const matchHistory = [
    { id: 'm1', date: 'Today, 10:24 AM', mode: '4P vs AI', result: 'Victory', color: 'red', captured: 5, rank: '1st' },
    { id: 'm2', date: 'Yesterday, 8:40 PM', mode: 'Online Room', result: 'Victory', color: 'yellow', captured: 3, rank: '1st' },
    { id: 'm3', date: 'Sep 28, 4:15 PM', mode: 'Pass & Play', result: 'Defeat', color: 'blue', captured: 2, rank: '2nd' },
    { id: 'm4', date: 'Sep 27, 9:10 PM', mode: '4P vs AI', result: 'Victory', color: 'green', captured: 6, rank: '1st' },
    { id: 'm5', date: 'Sep 26, 3:30 PM', mode: 'Online Room', result: 'Defeat', color: 'red', captured: 1, rank: '3rd' },
  ];

  const badges = [
    { id: 'b1', name: 'First Blood', desc: 'Capture your first opponent token', icon: '⚔️', unlocked: true },
    { id: 'b2', name: 'High Roller', desc: 'Roll three 6s in a single match', icon: '🎲', unlocked: true },
    { id: 'b3', name: 'Safe Haven', desc: 'Reach 4 safe star cells in one game', icon: '🛡️', unlocked: true },
    { id: 'b4', name: 'Grandmaster', desc: 'Win 50 arena matches', icon: '👑', unlocked: true },
    { id: 'b5', name: 'Untouchable', desc: 'Win a match without losing any token', icon: '✨', unlocked: false },
  ];

  const handleSaveName = () => {
    sound.playClick();
    setIsEditing(false);
    if (onUpdateUserName) {
      onUpdateUserName(userName);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-slate-700/80 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar with Selector */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border-2 border-purple-400/60 p-1 shadow-xl flex items-center justify-center text-5xl">
              {selectedAvatar}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-slate-950 border border-purple-500 rounded-xl px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{userName}</h1>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Arena Master
              </span>
            </div>

            {/* Level & XP Bar */}
            <div className="mt-3 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-purple-300">Level {stats.level} Warrior</span>
                <span className="text-slate-400">{stats.currentXp} / {stats.nextLevelXp} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Avatar picker strip */}
            <div className="mt-4 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Avatar:</span>
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatar(av);
                  }}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    selectedAvatar === av ? 'bg-purple-600 scale-110 shadow-md' : 'bg-slate-800/80 hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Matches Played</span>
          <span className="text-2xl sm:text-3xl font-black text-white">{stats.gamesPlayed}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Victories</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.gamesWon}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Win Rate</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400">{stats.winRate}%</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Tokens Captured</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">{stats.tokensCaptured}</span>
        </div>
      </div>

      {/* Match History & Badges Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match History Table (2 cols) */}
        <div className="md:col-span-2 p-5 rounded-3xl glass-panel-elevated border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-purple-400" />
              <span>Recent Arena Matches</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Last 5 Games</span>
          </div>

          <div className="space-y-2">
            {matchHistory.map((m) => {
              const isWin = m.result === 'Victory';
              return (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
                        isWin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {m.result}
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 block">{m.mode}</span>
                      <span className="text-[10px] text-slate-400">{m.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Captured</span>
                      <span className="font-bold text-purple-300">{m.captured} tokens</span>
                    </div>
                    <span className="font-black text-sm text-slate-100">{m.rank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges / Achievements (1 col) */}
        <div className="p-5 rounded-3xl glass-panel-elevated border border-slate-800">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Badges & Trophies</span>
          </h3>

          <div className="space-y-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                  b.unlocked
                    ? 'bg-slate-900/80 border-purple-500/30 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">{b.name}</span>
                    {b.unlocked && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
