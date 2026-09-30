/**
 * Player definitions, colors, avatars, and bot profiles.
 */

export const PLAYER_COLORS = ['red', 'green', 'yellow', 'blue'];

export const COLOR_THEMES = {
  red: {
    name: 'Ruby Red',
    colorHex: '#EF4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    glowClass: 'glow-red',
    lightHex: '#FCA5A5',
    darkHex: '#991B1B',
    avatar: '🦊',
  },
  green: {
    name: 'Emerald Green',
    colorHex: '#22C55E',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    glowClass: 'glow-green',
    lightHex: '#86EFAC',
    darkHex: '#166534',
    avatar: '🐉',
  },
  yellow: {
    name: 'Solar Yellow',
    colorHex: '#FACC15',
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-300',
    glowClass: 'glow-yellow',
    lightHex: '#FDE68A',
    darkHex: '#854D0E',
    avatar: '🦁',
  },
  blue: {
    name: 'Sapphire Blue',
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    glowClass: 'glow-blue',
    lightHex: '#93C5FD',
    darkHex: '#1E40AF',
    avatar: '🦅',
  },
};

export const BOT_NAMES = [
  'CyberKnight',
  'QuantumFox',
  'NovaStriker',
  'ApexPredator',
  'ValkyrieX',
  'PixelMaster',
];

/**
 * Generate default players for a given player count and game mode
 * @param {number} count 2, 3, or 4
 * @param {'local'|'ai'|'online'} mode
 * @param {string} localUserName
 */
export function createInitialPlayers(count = 4, mode = 'ai', localUserName = 'You') {
  let colors = [];
  if (count === 2) {
    // Red & Yellow opposite corners for classic 2-player balance
    colors = ['red', 'yellow'];
  } else if (count === 3) {
    colors = ['red', 'green', 'yellow'];
  } else {
    colors = ['red', 'green', 'yellow', 'blue'];
  }

  return colors.map((color, index) => {
    const isHuman = mode === 'local' || (mode === 'ai' && index === 0);
    const theme = COLOR_THEMES[color];

    let name = '';
    if (isHuman) {
      name = index === 0 ? localUserName : `Player ${index + 1}`;
    } else {
      name = `${BOT_NAMES[index % BOT_NAMES.length]} (AI)`;
    }

    return {
      id: `p-${color}`,
      color,
      name,
      avatar: theme.avatar,
      isBot: !isHuman,
      isHost: index === 0,
      isReady: true,
      tokens: [
        { id: 0, step: -1 }, // -1 = Yard
        { id: 1, step: -1 },
        { id: 2, step: -1 },
        { id: 3, step: -1 },
      ],
      stats: {
        captured: 0,
        lost: 0,
        sixesRolled: 0,
      },
    };
  });
}
