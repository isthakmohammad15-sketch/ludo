/**
 * Game state management and turn progression engine for Ludo Arena.
 */
import { createInitialPlayers } from './players.js';
import { getMovableTokenIds } from './gameRules.js';
import { applyTokenMove } from './movement.js';
import { sound } from './sound.js';

export const INITIAL_TIMER_SECONDS = 20;

export function createInitialState(options = {}) {
  const {
    playerCount = 4,
    mode = 'ai',
    userName = 'You',
  } = options;

  const players = createInitialPlayers(playerCount, mode, userName);

  return {
    mode,
    playerCount,
    players,
    activePlayerIndex: 0,
    turnState: 'rolling', // 'rolling' | 'moving' | 'animating' | 'finished'
    diceValue: null,
    isRolling: false,
    consecutiveSixes: 0,
    movableTokenIds: [],
    winner: null,
    rankings: [],
    history: [
      { id: '1', text: '🎮 Welcome to Ludo Arena! Red plays first.', type: 'system', timestamp: Date.now() },
    ],
    timer: INITIAL_TIMER_SECONDS,
    isPaused: false,
    settings: {
      sfx: true,
      music: false,
      autoRoll: false,
      speed: 'normal', // 'normal' | 'fast'
    },
    chat: [
      { id: 'c1', sender: 'System', text: 'Game room initialized. Have fun and play fair!', color: 'accent', timestamp: Date.now() },
    ],
  };
}

/**
 * Advance turn to the next unfinished player
 */
export function getNextPlayerIndex(currentIndex, players, rankings = []) {
  const total = players.length;
  let nextIdx = (currentIndex + 1) % total;
  let attempts = 0;

  // Skip players who have already won/finished all 4 tokens
  while (attempts < total) {
    const candidate = players[nextIdx];
    const isFinished = candidate.tokens.every(t => t.step === 56);
    if (!isFinished) {
      return nextIdx;
    }
    nextIdx = (nextIdx + 1) % total;
    attempts++;
  }
  return currentIndex;
}
