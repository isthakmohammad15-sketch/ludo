import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Flame, Star, Sparkles, Filter, RefreshCw, User } from 'lucide-react';
import { fetchLeaderboard } from '../game/api';
import { sound } from '../game/sound';

export default function Leaderboard({ currentUser }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'weekly' | 'friends'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard();
      // Tag current user if present
      const tagged = (data || []).map((item, idx) => ({
        ...item,
        rank: idx + 1,
        isCurrent: currentUser && (item.id === currentUser.id || item.name === currentUser.username),
      }));
      setLeaderboard(tagged);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Real-Time Hall of Fame</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Global Arena Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Live rankings aggregated from actual completed tournament matches
        </p>
      </div>

      {/* Filter Tabs & Refresh */}
      <div className="flex items-center justify-between flex-wrap gap-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'all', label: 'All-Time Ranks' },
            { id: 'weekly', label: 'This Week' },
            { id: 'friends', label: 'Friends' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter(tab.id);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            loadData();
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Refresh rankings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Live Refresh</span>
        </button>
      </div>

      {/* Top 3 Podium presentation */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-6">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 border-2 border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-slate-500/30">
                {top3[1]?.avatar || '🥈'}
              </div>
              <span className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
              {top3[1]?.name}
            </span>
            <span className="text-[11px] font-bold text-slate-400">{top3[1]?.points?.toLocaleString()} PTS</span>
            <div className="w-full h-24 sm:h-32 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-slate-400 flex items-center justify-center">
              <Medal className="w-8 h-8 text-slate-300" />
            </div>
          </div>

          {/* 1st Place Champion */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 fill-amber-400 mx-auto -mb-1 animate-bounce" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-2 border-amber-200 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-amber-500/40">
                {top3[0]?.avatar || '👑'}
              </div>
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow">
                1
              </span>
            </div>
            <span className="font-black text-sm sm:text-base text-amber-300 truncate max-w-full">
              {top3[0]?.name}
            </span>
            <span className="text-xs font-black text-amber-400">{top3[0]?.points?.toLocaleString()} PTS</span>
            <div className="w-full h-32 sm:h-44 mt-3 rounded-t-2xl bg-gradient-to-t from-amber-950/60 to-amber-600/30 border-t-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-10 h-10 text-amber-300 drop-shadow" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-900/40">
                {top3[2]?.avatar || '🥉'}
              </div>
              <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
              {top3[2]?.name}
            </span>
            <span className="text-[11px] font-bold text-amber-500">{top3[2]?.points?.toLocaleString()} PTS</span>
            <div className="w-full h-20 sm:h-24 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-amber-700 flex items-center justify-center">
              <Medal className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings Table */}
      <div className="rounded-3xl glass-panel-elevated border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Warrior</th>
                <th className="py-3.5 px-4 text-center">Level</th>
                <th className="py-3.5 px-4 text-center">Matches</th>
                <th className="py-3.5 px-4 text-center">Wins</th>
                <th className="py-3.5 px-4 text-center">Win Rate</th>
                <th className="py-3.5 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No leaderboard matches recorded yet. Play a match to appear here!
                  </td>
                </tr>
              ) : (
                leaderboard.map((item) => (
                  <tr
                    key={item.id || item.rank}
                    className={`
                      transition-colors
                      ${
                        item.isCurrent
                          ? 'bg-purple-950/40 border-y-2 border-purple-500/60 font-bold'
                          : 'hover:bg-slate-850/40 text-slate-300'
                      }
                    `}
                  >
                    <td className="py-3 px-4 font-mono font-black">
                      {item.rank <= 3 ? (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                            item.rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : item.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : 'bg-amber-700 text-white'
                          }`}
                        >
                          {item.rank}
                        </span>
                      ) : (
                        `#${item.rank}`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.avatar}</span>
                        <span className={item.isCurrent ? 'text-purple-300' : 'text-slate-100'}>
                          {item.name}
                        </span>
                        {item.isCurrent && (
                          <span className="text-[9px] bg-purple-500/30 text-purple-300 font-bold px-1.5 py-0.5 rounded-full uppercase">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      Lvl {item.level}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400">{item.games}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">{item.wins}</td>
                    <td className="py-3 px-4 text-center font-semibold text-purple-400">{item.winRate}%</td>
                    <td className="py-3 px-4 text-right font-black font-mono text-slate-100">
                      {item.points?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
