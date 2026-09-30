/**
 * Coordinates and path definitions for the 15x15 Ludo board.
 * Standard symmetrical track of 52 cells, with 4 home stretches and 4 yard bases.
 */

// 52 perimeter cells in clockwise order, starting from Red's start square
export const TRACK_PATH = [
  { r: 6, c: 1 },  // 0: RED START (Safe)
  { r: 6, c: 2 },  // 1
  { r: 6, c: 3 },  // 2
  { r: 6, c: 4 },  // 3
  { r: 6, c: 5 },  // 4
  { r: 5, c: 6 },  // 5 (Turn up)
  { r: 4, c: 6 },  // 6
  { r: 3, c: 6 },  // 7
  { r: 2, c: 6 },  // 8: Safe Star
  { r: 1, c: 6 },  // 9
  { r: 0, c: 6 },  // 10
  { r: 0, c: 7 },  // 11
  { r: 0, c: 8 },  // 12
  { r: 1, c: 8 },  // 13: GREEN START (Safe)
  { r: 2, c: 8 },  // 14
  { r: 3, c: 8 },  // 15
  { r: 4, c: 8 },  // 16
  { r: 5, c: 8 },  // 17
  { r: 6, c: 9 },  // 18 (Turn right)
  { r: 6, c: 10 }, // 19
  { r: 6, c: 11 }, // 20
  { r: 6, c: 12 }, // 21: Safe Star
  { r: 6, c: 13 }, // 22
  { r: 6, c: 14 }, // 23
  { r: 7, c: 14 }, // 24
  { r: 8, c: 14 }, // 25
  { r: 8, c: 13 }, // 26: YELLOW START (Safe)
  { r: 8, c: 12 }, // 27
  { r: 8, c: 11 }, // 28
  { r: 8, c: 10 }, // 29
  { r: 8, c: 9 },  // 30
  { r: 9, c: 8 },  // 31 (Turn down)
  { r: 10, c: 8 }, // 32
  { r: 11, c: 8 }, // 33
  { r: 12, c: 8 }, // 34: Safe Star
  { r: 13, c: 8 }, // 35
  { r: 14, c: 8 }, // 36
  { r: 14, c: 7 }, // 37
  { r: 14, c: 6 }, // 38
  { r: 13, c: 6 }, // 39: BLUE START (Safe)
  { r: 12, c: 6 }, // 40
  { r: 11, c: 6 }, // 41
  { r: 10, c: 6 }, // 42
  { r: 9, c: 6 },  // 43
  { r: 8, c: 5 },  // 44 (Turn left)
  { r: 8, c: 4 },  // 45
  { r: 8, c: 3 },  // 46
  { r: 8, c: 2 },  // 47: Safe Star
  { r: 8, c: 1 },  // 48
  { r: 8, c: 0 },  // 49
  { r: 7, c: 0 },  // 50 (Turn into Red home stretch)
  { r: 6, c: 0 },  // 51
];

// Player start index on the 52-cell track
export const PLAYER_CONFIG = {
  red: {
    id: 'red',
    name: 'Red',
    startIndex: 0,
    colorHex: '#EF4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    glowClass: 'glow-red',
    yardCoords: [
      { r: 1.5, c: 1.5 },
      { r: 1.5, c: 3.5 },
      { r: 3.5, c: 1.5 },
      { r: 3.5, c: 3.5 },
    ],
    homeStretch: [
      { r: 7, c: 1 },
      { r: 7, c: 2 },
      { r: 7, c: 3 },
      { r: 7, c: 4 },
      { r: 7, c: 5 },
    ],
    homeTarget: { r: 7, c: 6 }, // Red center entrance
  },
  green: {
    id: 'green',
    name: 'Green',
    startIndex: 13,
    colorHex: '#22C55E',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    glowClass: 'glow-green',
    yardCoords: [
      { r: 1.5, c: 10.5 },
      { r: 1.5, c: 12.5 },
      { r: 3.5, c: 10.5 },
      { r: 3.5, c: 12.5 },
    ],
    homeStretch: [
      { r: 1, c: 7 },
      { r: 2, c: 7 },
      { r: 3, c: 7 },
      { r: 4, c: 7 },
      { r: 5, c: 7 },
    ],
    homeTarget: { r: 6, c: 7 }, // Green center entrance
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    startIndex: 26,
    colorHex: '#FACC15',
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-300',
    glowClass: 'glow-yellow',
    yardCoords: [
      { r: 10.5, c: 10.5 },
      { r: 10.5, c: 12.5 },
      { r: 12.5, c: 10.5 },
      { r: 12.5, c: 12.5 },
    ],
    homeStretch: [
      { r: 7, c: 13 },
      { r: 7, c: 12 },
      { r: 7, c: 11 },
      { r: 7, c: 10 },
      { r: 7, c: 9 },
    ],
    homeTarget: { r: 7, c: 8 }, // Yellow center entrance
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    startIndex: 39,
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    glowClass: 'glow-blue',
    yardCoords: [
      { r: 10.5, c: 1.5 },
      { r: 10.5, c: 3.5 },
      { r: 12.5, c: 1.5 },
      { r: 12.5, c: 3.5 },
    ],
    homeStretch: [
      { r: 13, c: 7 },
      { r: 12, c: 7 },
      { r: 11, c: 7 },
      { r: 10, c: 7 },
      { r: 9, c: 7 },
    ],
    homeTarget: { r: 8, c: 7 }, // Blue center entrance
  },
};

// Safe track indexes on the 52-cell track
export const SAFE_TRACK_INDEXES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

/**
 * Check if a global track index is safe
 */
export function isGlobalTrackSafe(globalTrackIndex) {
  return SAFE_TRACK_INDEXES.has(globalTrackIndex);
}

/**
 * Get the exact board coordinates (r, c) for a token given its player and relative step
 * step = -1 : inside player yard
 * step = 0..50 : on common track
 * step = 51..55 : on player's colored home stretch
 * step = 56 : center home (finished)
 */
export function getTokenCoordinates(color, step, tokenIndex = 0) {
  const cfg = PLAYER_CONFIG[color];
  if (!cfg) return { r: 0, c: 0 };

  if (step === -1) {
    return cfg.yardCoords[tokenIndex] || { r: 0, c: 0 };
  }

  if (step >= 0 && step <= 50) {
    const globalIdx = (cfg.startIndex + step) % 52;
    return TRACK_PATH[globalIdx];
  }

  if (step >= 51 && step <= 55) {
    const stretchIdx = step - 51;
    return cfg.homeStretch[stretchIdx];
  }

  if (step >= 56) {
    return cfg.homeTarget;
  }

  return { r: 0, c: 0 };
}

/**
 * Convert player's relative step to global track index (or null if in yard / home stretch)
 */
export function getGlobalTrackIndex(color, step) {
  if (step >= 0 && step <= 50) {
    const cfg = PLAYER_CONFIG[color];
    return (cfg.startIndex + step) % 52;
  }
  return null;
}
