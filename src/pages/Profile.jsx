import React, { useState, useEffect } from 'react';
import { User, Trophy, Award, Swords, Shield, Zap, Sparkles, Check, Edit2, LogOut } from 'lucide-react';
import { fetchUserMatches } from '../game/api';
import { sound } from '../game/sound';

const AVATAR_OPTIONS = ['🦊', '🐉', '🦁', '🦅', '🐺', '⚡', '👑', '🤖'];

export default function Profile({
  currentUser,
  onUpdateUser,
  onLogout,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.username || 'Warrior');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || '🦊');
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserMatches(currentUser.id)
        .then(matches => setMatchHistory(matches || []))
        .catch(err => console.error('Failed to load user matches:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const level = currentUser?.level || 1;
  const xp = currentUser?.xp || 0;
  const nextLevelXp = level * 500;
  const xpPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  const stats = {
    gamesPlayed: currentUser?.gamesPlayed || 0,
    gamesWon: currentUser?.gamesWon || 0,
    winRate: currentUser?.gamesPlayed ? Math.round((currentUser.gamesWon / currentUser.gamesPlayed) * 1000) / 10 : 0,
    tokensCaptured: currentUser?.tokensCaptured || 0,
    tokensLost: currentUser?.tokensLost || 0,
    points: currentUser?.points || 0,
  };

  const badges = [
    { id: 'b1', name: 'First Blood', desc: 'Capture an opponent token', icon: '⚔️', unlocked: stats.tokensCaptured > 0 },
    { id: 'b2', name: 'Arena Victor', desc: 'Win your first arena match', icon: '🏆', unlocked: stats.gamesWon > 0 },
    { id: 'b3', name: 'Master Strategist', desc: 'Win 5 arena matches', icon: '👑', unlocked: stats.gamesWon >= 5 },
    { id: 'b4', name: 'Century Club', desc: 'Reach 100+ points', icon: '⚡', unlocked: stats.points >= 100 },
  ];

  const handleSaveProfile = () => {
    sound.playClick();
    setIsEditing(false);
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        username: editName,
        avatar: selectedAvatar,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-slate-700/80 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border-2 border-purple-400/60 p-1 shadow-xl flex items-center justify-center text-5xl">
              {currentUser?.avatar || selectedAvatar}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-950 border border-purple-500 rounded-xl px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      {currentUser?.username || 'Warrior'}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Level {level}
                </span>
              </div>

              {/* Logout Button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onLogout();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-red-950/40 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>

            {/* Level & XP Bar */}
            <div className="mt-3 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-purple-300">Level {level} Arena Fighter</span>
                <span className="text-slate-400">{xp} / {nextLevelXp} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Avatar picker strip */}
            {isEditing && (
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
                      selectedAvatar === av ? 'bg-purple-600 scale-110 shadow-md ring-2 ring-white' : 'bg-slate-800/80 hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Stats Cards Grid */}
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
        {/* Real Match History Table */}
        <div className="md:col-span-2 p-5 rounded-3xl glass-panel-elevated border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-purple-400" />
              <span>Real Match History</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{matchHistory.length} Recorded</span>
          </div>

          {matchHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matches recorded yet. Jump into an arena match to start building your battle history!
            </div>
          ) : (
            <div className="space-y-2">
              {matchHistory.map((m) => {
                const myParticipant = m.participants?.find(p => p.userId === currentUser.id);
                const isWin = myParticipant?.isWinner || m.winnerId === currentUser.id;

                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
                          isWin
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {isWin ? 'Victory' : 'Defeat'}
                      </span>
                      <div>
                        <span className="font-bold text-slate-200 block">{m.mode}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(m.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Captured</span>
                        <span className="font-bold text-purple-300">{myParticipant?.captured || 0} tokens</span>
                      </div>
                      <span className="font-black text-sm text-slate-100">{myParticipant?.rank || (isWin ? '1st' : '2nd')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges / Achievements */}
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
