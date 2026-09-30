import React, { useState } from 'react';
import { Play, Users, Bot, Globe, Shield, Sparkles, Trophy, Dices, ChevronRight, Zap, ArrowRight, Star } from 'lucide-react';
import { sound } from '../game/sound';

export default function Home({
  currentUser = null,
  onStartGame,
  onNavigateToLobby,
  onJoinRoom,
}) {
  const [selectedMode, setSelectedMode] = useState('ai');
  const [playerCount, setPlayerCount] = useState(4);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState('');

  const handleLaunch = () => {
    sound.playClick();
    if (selectedMode === 'online') {
      onNavigateToLobby({ playerCount, mode: 'online' });
    } else {
      onStartGame({ mode: selectedMode, playerCount, userName: currentUser?.username || 'You' });
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    sound.playClick();
    onJoinRoom(roomCodeInput.trim().toUpperCase());
    setJoinModalOpen(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-between pb-12 overflow-hidden">
      {/* Background Neon ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 text-center z-10">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Next-Gen Multiplayer Ludo Arena</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Roll the Dice. Conquer the Track.{' '}
          <span className="bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Claim Victory.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience the world's favorite board game with physics-inspired 3D dice, intelligent AI opponents, and instant real-time rooms.
        </p>

        {/* Game Mode Selector Card */}
        <div className="w-full max-w-3xl mx-auto p-5 sm:p-7 rounded-3xl glass-panel-elevated border border-slate-700/80 shadow-2xl mb-12 text-left">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1 flex items-center justify-between">
            <span>1. Choose Battle Mode</span>
            <span className="text-purple-400 font-semibold">Ready to Roll</span>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Vs AI */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedMode('ai');
              }}
              className={`
                relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
                ${
                  selectedMode === 'ai'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }
              `}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-100 text-base">Vs Computer</h3>
                <p className="text-slate-400 text-xs mt-1 leading-normal">
                  Challenge smart tactical AI bots in single player mode.
                </p>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 mt-3 inline-block uppercase">
                Solo Offline
              </span>
            </button>

            {/* Pass & Play */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedMode('local');
              }}
              className={`
                relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
                ${
                  selectedMode === 'local'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }
              `}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-100 text-base">Pass & Play</h3>
                <p className="text-slate-400 text-xs mt-1 leading-normal">
                  Play with friends or family on this same screen.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 mt-3 inline-block uppercase">
                Same Device
              </span>
            </button>

            {/* Play with Friends */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedMode('online');
              }}
              className={`
                relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
                ${
                  selectedMode === 'online'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }
              `}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-100 text-base">Play With Friends</h3>
                <p className="text-slate-400 text-xs mt-1 leading-normal">
                  Create custom private rooms or join with a room code.
                </p>
              </div>
              <span className="text-[10px] font-bold text-purple-400 mt-3 inline-block uppercase">
                Multi-Tab / Online
              </span>
            </button>
          </div>

          {/* Player Count Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                2. Player Count
              </span>
              <span className="text-xs text-slate-500">Choose 2, 3, or 4 warriors</span>
            </div>

            <div className="flex items-center gap-2">
              {[2, 3, 4].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPlayerCount(count);
                  }}
                  className={`
                    w-12 h-10 rounded-xl font-black text-sm transition-all cursor-pointer flex items-center justify-center
                    ${
                      playerCount === count
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40 scale-105'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    }
                  `}
                >
                  {count}P
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleLaunch}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl font-extrabold text-base uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-purple-600/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-1 ring-white/20"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{selectedMode === 'online' ? 'Create Custom Room' : 'Start Match Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setJoinModalOpen(true);
              }}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-2">
              <Dices className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">3D Physics Dice</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Smooth tumbling roll with pips</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Official Rules</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Safe star cells, captures & 6s</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Instant Rooms</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero lag cross-tab multiplayer</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Leaderboards</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Live ranks, stats & trophy XP</p>
          </div>
        </div>
      </div>

      {/* Join Room Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm p-6 rounded-3xl glass-panel-elevated border border-slate-700 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-1">Join Multiplayer Room</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the 5-character Room ID provided by your host (e.g. <span className="text-purple-400 font-mono">LUDO-7X92A</span>).
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                  placeholder="LUDO-XXXXX"
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-base text-purple-300 placeholder-slate-600 uppercase focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
                >
                  Enter Room
                </button>
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
