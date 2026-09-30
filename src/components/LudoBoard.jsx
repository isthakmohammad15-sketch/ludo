import React, { useMemo } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import LudoCell from './LudoCell';
import Token from './Token';
import { getTokenCoordinates, TRACK_PATH } from '../game/coordinates';

// Track Safe cells: indices on TRACK_PATH: 0, 8, 13, 21, 26, 34, 39, 47
const SAFE_COORDS = new Set([
  '6,1',   // Red Start (safe)
  '2,6',   // Top Safe Star
  '1,8',   // Green Start (safe)
  '6,12',  // Right Safe Star
  '8,13',  // Yellow Start (safe)
  '12,8',  // Bottom Safe Star
  '13,6',  // Blue Start (safe)
  '8,2',   // Left Safe Star
]);

const START_CELLS = {
  '6,1': 'red',
  '1,8': 'green',
  '8,13': 'yellow',
  '13,6': 'blue',
};

const HOME_STRETCH_CELLS = {
  // Red (row 7, cols 1..5)
  '7,1': 'red', '7,2': 'red', '7,3': 'red', '7,4': 'red', '7,5': 'red',
  // Green (col 7, rows 1..5)
  '1,7': 'green', '2,7': 'green', '3,7': 'green', '4,7': 'green', '5,7': 'green',
  // Yellow (row 7, cols 9..13)
  '7,9': 'yellow', '7,10': 'yellow', '7,11': 'yellow', '7,12': 'yellow', '7,13': 'yellow',
  // Blue (col 7, rows 9..13)
  '9,7': 'blue', '10,7': 'blue', '11,7': 'blue', '12,7': 'blue', '13,7': 'blue',
};

export default function LudoBoard({
  players = [],
  activePlayerIndex = 0,
  movableTokenIds = [],
  onTokenClick,
  diceValue = null,
}) {
  const activePlayer = players[activePlayerIndex] || {};
  const activeColor = activePlayer.color;

  // Map tokens to coordinates for quick lookup on cells
  const cellTokensMap = useMemo(() => {
    const map = new Map();

    players.forEach(player => {
      player.tokens.forEach((token, tIdx) => {
        // Only track tokens currently on the board path (0..55)
        if (token.step >= 0 && token.step < 56) {
          const coord = getTokenCoordinates(player.color, token.step, tIdx);
          const key = `${coord.r},${coord.c}`;
          if (!map.has(key)) {
            map.set(key, []);
          }
          map.get(key).push({
            playerColor: player.color,
            tokenId: token.id,
            step: token.step,
          });
        }
      });
    });

    return map;
  }, [players]);

  // Finished tokens grouped by color for center display
  const finishedTokensByColor = useMemo(() => {
    const counts = { red: [], green: [], yellow: [], blue: [] };
    players.forEach(p => {
      p.tokens.forEach(t => {
        if (t.step === 56) {
          counts[p.color]?.push(t.id);
        }
      });
    });
    return counts;
  }, [players]);

  // Yard rendering helper
  const renderYard = (color, rowStart, colStart, title) => {
    const player = players.find(p => p.color === color);
    const isActive = activeColor === color;
    const yardTokens = player ? player.tokens.filter(t => t.step === -1) : [];

    const borderStyle = {
      red: 'border-red-500/60 shadow-[inset_0_0_30px_rgba(239,68,68,0.25)]',
      green: 'border-emerald-500/60 shadow-[inset_0_0_30px_rgba(34,197,94,0.25)]',
      yellow: 'border-amber-400/60 shadow-[inset_0_0_30px_rgba(250,204,21,0.25)]',
      blue: 'border-blue-500/60 shadow-[inset_0_0_30px_rgba(59,130,246,0.25)]',
    }[color];

    const bgGlow = {
      red: 'bg-gradient-to-br from-red-950/70 via-[#131B2E] to-red-900/30',
      green: 'bg-gradient-to-br from-emerald-950/70 via-[#131B2E] to-emerald-900/30',
      yellow: 'bg-gradient-to-br from-amber-950/70 via-[#131B2E] to-amber-900/30',
      blue: 'bg-gradient-to-br from-blue-950/70 via-[#131B2E] to-blue-900/30',
    }[color];

    const textColor = {
      red: 'text-red-400',
      green: 'text-emerald-400',
      yellow: 'text-amber-300',
      blue: 'text-blue-400',
    }[color];

    return (
      <div
        style={{
          gridRow: `${rowStart} / ${rowStart + 6}`,
          gridColumn: `${colStart} / ${colStart + 6}`,
        }}
        className={`
          relative border-2 ${borderStyle} ${bgGlow}
          rounded-xl p-2 sm:p-3 flex flex-col justify-between items-center
          transition-all duration-300
          ${isActive ? 'ring-2 ring-white/60 brightness-110' : 'opacity-90'}
        `}
      >
        {/* Yard Header */}
        <div className="w-full flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg">{player?.avatar || '👤'}</span>
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${textColor}`}>
              {player?.name || title}
            </span>
          </div>
          {isActive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
        </div>

        {/* Inner White/Dark Circle with 4 pedestals */}
        <div className="relative w-4/5 h-4/5 rounded-2xl bg-[#0B0F1D]/80 border border-white/10 p-2 sm:p-3 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 place-items-center shadow-inner">
          {[0, 1, 2, 3].map(slotIdx => {
            const token = player?.tokens[slotIdx];
            const inYard = token && token.step === -1;
            const isMovable = inYard && isActive && movableTokenIds.includes(token.id);

            return (
              <div
                key={slotIdx}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#162035] border border-white/10 flex items-center justify-center shadow-inner relative"
              >
                {inYard && (
                  <Token
                    color={color}
                    tokenId={token.id}
                    isMovable={isMovable}
                    onClick={() => onTokenClick(token.id)}
                    size="md"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Yard Footer status */}
        <div className="text-[10px] text-slate-400 font-medium">
          {yardTokens.length} in base
        </div>
      </div>
    );
  };

  // Generate list of arm cells
  const armCells = useMemo(() => {
    const cells = [];

    // Helper to add cell if within arms
    const checkAndAdd = (r, c) => {
      // Exclude the 4 yards (6x6 each)
      if (r < 6 && c < 6) return; // Top-Left Red yard
      if (r < 6 && c > 8) return; // Top-Right Green yard
      if (r > 8 && c > 8) return; // Bottom-Right Yellow yard
      if (r > 8 && c < 6) return; // Bottom-Left Blue yard
      // Exclude center (3x3: r 6..8, c 6..8)
      if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return;

      const key = `${r},${c}`;
      cells.push({
        r,
        c,
        key,
        isSafe: SAFE_COORDS.has(key),
        isStart: START_CELLS[key] !== undefined,
        startColor: START_CELLS[key] || null,
        homeStretchColor: HOME_STRETCH_CELLS[key] || null,
      });
    };

    // Iterate through grid
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        checkAndAdd(r, c);
      }
    }

    return cells;
  }, []);

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto p-1.5 sm:p-2.5 rounded-2xl bg-[#0C1222] border-2 border-slate-700/50 shadow-2xl select-none">
      {/* 15x15 CSS Grid */}
      <div
        className="w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(15, minmax(0, 1fr))',
        }}
      >
        {/* 1. Four 6x6 Home Yards */}
        {renderYard('red', 1, 1, 'Ruby Red')}
        {renderYard('green', 1, 10, 'Emerald Green')}
        {renderYard('yellow', 10, 10, 'Solar Yellow')}
        {renderYard('blue', 10, 1, 'Sapphire Blue')}

        {/* 2. Center 3x3 Home Victory Area */}
        <div
          style={{
            gridRow: '7 / 10',
            gridColumn: '7 / 10',
          }}
          className="relative bg-[#090D18] border border-white/20 overflow-hidden flex items-center justify-center shadow-2xl"
        >
          {/* Triangular colored victory bays */}
          {/* Left Red Triangle */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-red-600/70 to-transparent flex items-center justify-start pl-1 sm:pl-2"
            style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }}
          >
            {finishedTokensByColor.red.length > 0 && (
              <span className="text-[10px] sm:text-xs font-black text-white bg-red-700/90 rounded-full px-1 sm:px-1.5 py-0.5">
                {finishedTokensByColor.red.length}/4
              </span>
            )}
          </div>

          {/* Top Green Triangle */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-emerald-600/70 to-transparent flex justify-center items-start pt-1 sm:pt-2"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)' }}
          >
            {finishedTokensByColor.green.length > 0 && (
              <span className="text-[10px] sm:text-xs font-black text-white bg-emerald-700/90 rounded-full px-1 sm:px-1.5 py-0.5">
                {finishedTokensByColor.green.length}/4
              </span>
            )}
          </div>

          {/* Right Yellow Triangle */}
          <div
            className="absolute inset-0 bg-gradient-to-l from-amber-500/70 to-transparent flex items-center justify-end pr-1 sm:pr-2"
            style={{ clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)' }}
          >
            {finishedTokensByColor.yellow.length > 0 && (
              <span className="text-[10px] sm:text-xs font-black text-slate-900 bg-amber-400 rounded-full px-1 sm:px-1.5 py-0.5">
                {finishedTokensByColor.yellow.length}/4
              </span>
            )}
          </div>

          {/* Bottom Blue Triangle */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent flex justify-center items-end pb-1 sm:pb-2"
            style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }}
          >
            {finishedTokensByColor.blue.length > 0 && (
              <span className="text-[10px] sm:text-xs font-black text-white bg-blue-700/90 rounded-full px-1 sm:px-1.5 py-0.5">
                {finishedTokensByColor.blue.length}/4
              </span>
            )}
          </div>

          {/* Center Royal Medallion */}
          <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-2 border-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-slate-950 fill-slate-950/20 drop-shadow" />
          </div>
        </div>

        {/* 3. Individual Arm Cells */}
        {armCells.map(cell => (
          <LudoCell
            key={cell.key}
            r={cell.r}
            c={cell.c}
            isSafe={cell.isSafe}
            isStart={cell.isStart}
            startColor={cell.startColor}
            homeStretchColor={cell.homeStretchColor}
            tokensHere={cellTokensMap.get(cell.key) || []}
            movableTokenIds={movableTokenIds}
            activePlayerColor={activeColor}
            onTokenClick={onTokenClick}
          />
        ))}
      </div>
    </div>
  );
}
