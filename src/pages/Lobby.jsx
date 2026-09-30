import React, { useState, useEffect } from 'react';
import { Users, Crown, Check, Copy, Bot, Play, LogOut, MessageSquare, Send, AlertCircle, Wifi, Shield } from 'lucide-react';
import { multiplayer } from '../game/multiplayer';
import { COLOR_THEMES, PLAYER_COLORS } from '../game/players';
import { sound } from '../game/sound';

export default function Lobby({
  roomId: propRoomId,
  isHost = true,
  playerCount = 4,
  onStartGame,
  onLeave,
  currentUser = { id: 'u-1', username: 'You', avatar: '🦊' },
}) {
  const [roomId] = useState(propRoomId || multiplayer.generateRoomId());
  const [copied, setCopied] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Setup real-time multiplayer room lifecycle
  useEffect(() => {
    if (isHost && !propRoomId) {
      multiplayer.createRoom(roomId, currentUser, playerCount);
    } else {
      multiplayer.joinRoom(roomId, currentUser);
    }

    const unsubCreated = multiplayer.on('room-created', ({ room }) => {
      setRoomData(room);
    });

    const unsubJoined = multiplayer.on('room-joined', ({ room }) => {
      setRoomData(room);
    });

    const unsubUpdated = multiplayer.on('room-updated', ({ room }) => {
      sound.playSafeLanding();
      setRoomData(room);
    });

    const unsubError = multiplayer.on('join-error', ({ message }) => {
      setError(message);
    });

    const unsubStart = multiplayer.on('game-started', ({ config }) => {
      sound.playSixRoll();
      onStartGame(config);
    });

    const unsubChat = multiplayer.on('chat-message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    return () => {
      unsubCreated();
      unsubJoined();
      unsubUpdated();
      unsubError();
      unsubStart();
      unsubChat();
      multiplayer.leaveRoom();
    };
  }, [roomId, isHost, propRoomId]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomId);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBot = (slotIdx) => {
    sound.playClick();
    multiplayer.addBot(slotIdx);
  };

  const handleToggleReady = () => {
    sound.playClick();
    if (!roomData) return;
    const mySlot = roomData.players.find(p => p.userId === currentUser.id);
    const nextReady = !mySlot?.isReady;
    multiplayer.setReady(nextReady);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sound.playClick();
    const newMsg = {
      id: Date.now().toString(),
      sender: currentUser.username || currentUser.name || 'You',
      text: chatInput.trim(),
      timestamp: Date.now(),
    };
    multiplayer.sendChatMessage(newMsg);
    setChatInput('');
  };

  // Extract players array
  const players = roomData?.players || [
    {
      userId: currentUser.id,
      name: currentUser.username || 'You',
      avatar: currentUser.avatar || '🦊',
      color: 'red',
      isHost,
      isReady: true,
      isBot: false,
    },
    { userId: null, name: 'Open Slot', avatar: '⏳', color: 'green', isHost: false, isReady: false, isBot: false },
    { userId: null, name: 'Open Slot', avatar: '⏳', color: 'yellow', isHost: false, isReady: false, isBot: false },
    { userId: null, name: 'Open Slot', avatar: '⏳', color: 'blue', isHost: false, isReady: false, isBot: false },
  ].slice(0, playerCount);

  const readyCount = players.filter(p => p.isReady).length;
  const canStart = readyCount >= 2;
  const amHost = roomData ? roomData.players.find(p => p.userId === currentUser.id)?.isHost : isHost;

  const handleLaunchMatch = () => {
    sound.playClick();
    multiplayer.startGame({
      mode: 'online',
      roomId,
      playerCount: players.length,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Error alert */}
      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-red-950/70 border border-red-500/60 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onLeave}
            className="px-3 py-1 rounded-lg bg-red-800 text-white font-bold"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Header card */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-slate-700/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Live Multiplayer Arena</h2>
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Wifi className="w-3 h-3 animate-pulse" /> Live Server
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time WebSocket match. Share the Room ID or invite code with friends!
          </p>
        </div>

        {/* Room Code Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 border-2 border-purple-500/40 px-4 py-2.5 rounded-2xl shadow-lg">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Room ID</span>
            <span className="text-lg font-mono font-black text-purple-300 tracking-wider">{roomId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
            title="Copy Room Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player Roster (Left 2 cols) */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Player Slots ({readyCount}/{players.length} Ready)
            </span>
            <span className="text-xs text-purple-400 font-semibold">
              Min 2 players to start
            </span>
          </div>

          {players.map((p, idx) => {
            const color = PLAYER_COLORS[idx];
            const theme = COLOR_THEMES[color];
            const isMe = p.userId === currentUser.id;
            const isOpenSlot = p.name === 'Open Slot' || !p.userId;

            return (
              <div
                key={p.userId || `slot-${idx}`}
                className={`
                  p-4 rounded-2xl border transition-all flex items-center justify-between
                  ${
                    isOpenSlot
                      ? 'bg-slate-900/40 border-dashed border-slate-800 text-slate-500'
                      : `bg-[#111827]/90 border-${color === 'red' ? 'red' : color === 'green' ? 'emerald' : color === 'yellow' ? 'amber' : 'blue'}-500/50 shadow-md`
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-[#162035] border border-white/10 ${theme?.borderClass}`}>
                    {p.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-sm ${isOpenSlot ? 'text-slate-500' : 'text-slate-100'}`}>
                        {p.name}
                      </span>
                      {p.isHost && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Host" />
                      )}
                      {p.isBot && (
                        <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" title="AI Bot" />
                      )}
                      {isMe && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${theme?.textClass}`}>
                      {theme?.name}
                    </span>
                  </div>
                </div>

                {/* Right status / Action */}
                <div className="flex items-center gap-2">
                  {isOpenSlot ? (
                    amHost && (
                      <button
                        type="button"
                        onClick={() => handleAddBot(idx)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add AI Bot</span>
                      </button>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      {isMe && !p.isHost ? (
                        <button
                          type="button"
                          onClick={handleToggleReady}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            p.isReady
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {p.isReady ? 'Ready ✓' : 'Click to Ready'}
                        </button>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            p.isReady
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.isReady ? 'Ready' : 'Waiting'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Action Row */}
          <div className="pt-4 flex items-center gap-3">
            {amHost ? (
              <button
                type="button"
                onClick={handleLaunchMatch}
                disabled={!canStart}
                className={`
                  flex-1 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider
                  flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${
                    canStart
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-purple-600/40 hover:brightness-110 active:scale-98'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }
                `}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Real Match</span>
              </button>
            ) : (
              <div className="flex-1 text-center py-3.5 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Waiting for Host to start the match...
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onLeave();
              }}
              className="py-3.5 px-5 rounded-2xl font-bold text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Pre-game Chat Panel (Right 1 col) */}
        <div className="flex flex-col h-[400px] rounded-2xl glass-panel-elevated border border-slate-800 overflow-hidden">
          <div className="px-3 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Lobby Chat
            </span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {chatMessages.length === 0 ? (
              <div className="text-slate-500 text-center mt-6">
                Room created. Chat with your opponents here!
              </div>
            ) : (
              chatMessages.map((m) => (
                <div key={m.id} className="text-slate-300">
                  <span className="font-bold text-purple-400 mr-1.5">{m.sender}:</span>
                  <span>{m.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-2 bg-slate-900 border-t border-slate-800 flex gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Chat in lobby..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-1.5 rounded-xl bg-purple-600 text-white disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
