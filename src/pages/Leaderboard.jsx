import React, { useState } from 'react';
import { Trophy, Crown, Medal, Flame, Star, Sparkles, Filter } from 'lucide-react';
import { sound } from '../game/sound';

const DEMO_LEADERBOARD = [
  { rank: 1, name: 'ValkyriePrime', avatar: '👑', level: 42, games: 320, wins: 245, winRate: 76.5, points: 14850 },
  { rank: 2, name: 'NeonPhantom', avatar: '⚡', level: 38, games: 290, wins: 204, winRate: 70.3, points: 12900 },
  { rank: 3, name: 'DragonSlayer', avatar: '🐉', level: 35, games: 260, wins: 178, winRate: 68.4, points: 11450 },
  { rank: 4, name: 'Alex Mercer (You)', avatar: '🦊', level: 14, games: 86, wins: 53, winRate: 61.6, points: 3450, isCurrent: true },
  { rank: 5, name: 'PixelSamurai', avatar: '🗡️', level: 31, games: 215, wins: 139, winRate: 64.6, points: 9200 },
  { rank: 6, name: 'ShadowHunter', avatar: '🦅', level: 28, games: 180, wins: 112, winRate: 62.2, points: 8100 },
  { rank: 7, name: 'ApexGladiator', avatar: '🦁', level: 25, games: 165, wins: 98, winRate: 59.3, points: 7300 },
  { rank: 8, name: 'CyberTitan', avatar: '🤖', level: 22, games: 140, wins: 82, winRate: 58.5, points: 6400 },
  { rank: 9, name: 'MysticRanger', avatar: '🔮', level: 19, games: 110, wins: 62, winRate: 56.3, points: 4900 },
  { rank: 10, name: 'StarGazer', avatar: '⭐', level: 16, games: 95, wins: 51, winRate: 53.6, points: 4100 },
];

export default function Leaderboard() {
  const [filter, setFilter] = useState('all'); // 'all' | 'weekly' | 'friends'

  const top3 = DEMO_LEADERBOARD.slice(0, 3);
  const remaining = DEMO_LEADERBOARD.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Hall of Fame</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Global Arena Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Top warriors across all tournament game modes
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
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
      </div>

      {/* Top 3 Podium presentation */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-6">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 border-2 border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-slate-500/30">
              {top3[1]?.avatar}
            </div>
            <span className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
              2
            </span>
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
            {top3[1]?.name}
          </span>
          <span className="text-[11px] font-bold text-slate-400">{top3[1]?.points.toLocaleString()} PTS</span>
          <div className="w-full h-24 sm:h-32 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-slate-400 flex items-center justify-center">
            <Medal className="w-8 h-8 text-slate-300" />
          </div>
        </div>

        {/* 1st Place Champion */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 fill-amber-400 mx-auto -mb-1 animate-bounce" />
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-2 border-amber-200 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-amber-500/40">
              {top3[0]?.avatar}
            </div>
            <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow">
              1
            </span>
          </div>
          <span className="font-black text-sm sm:text-base text-amber-300 truncate max-w-full">
            {top3[0]?.name}
          </span>
          <span className="text-xs font-black text-amber-400">{top3[0]?.points.toLocaleString()} PTS</span>
          <div className="w-full h-32 sm:h-44 mt-3 rounded-t-2xl bg-gradient-to-t from-amber-950/60 to-amber-600/30 border-t-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-10 h-10 text-amber-300 drop-shadow" />
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-900/40">
              {top3[2]?.avatar}
            </div>
            <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
              3
            </span>
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-slate-200 truncate max-w-full">
            {top3[2]?.name}
          </span>
          <span className="text-[11px] font-bold text-amber-500">{top3[2]?.points.toLocaleString()} PTS</span>
          <div className="w-full h-20 sm:h-24 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-amber-700 flex items-center justify-center">
            <Medal className="w-7 h-7 text-amber-600" />
          </div>
        </div>
      </div>

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
              {DEMO_LEADERBOARD.map((item) => (
                <tr
                  key={item.rank}
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
                    {item.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
