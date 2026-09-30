/**
 * Ludo Arena standard game rules & validations.
 */
import { getGlobalTrackIndex, isGlobalTrackSafe } from './coordinates.js';

export const WINNING_STEP = 56;
export const MAX_TRACK_STEP = 50;
export const HOME_STRETCH_START = 51;
export const MAX_CONSECUTIVE_SIXES = 3;

/**
 * Determine if a specific token can legally move given a rolled dice value
 * @param {Object} token - { id, step }
 * @param {number} dice - rolled number 1..6
 * @returns {boolean}
 */
export function canTokenMove(token, dice) {
  if (!token || !dice) return false;

  // In Yard: Can only move out if rolling a 6
  if (token.step === -1) {
    return dice === 6;
  }

  // Already home: Cannot move
  if (token.step >= WINNING_STEP) {
    return false;
  }

  // On track / home stretch: Cannot overshoot final home step 56
  return token.step + dice <= WINNING_STEP;
}

/**
 * Get all valid token IDs that can move for the current player
 * @param {Array} tokens - player's 4 tokens
 * @param {number} dice - rolled number 1..6
 * @returns {number[]} - array of valid token IDs
 */
export function getMovableTokenIds(tokens, dice) {
  if (!tokens || !dice) return [];
  return tokens
    .filter(token => canTokenMove(token, dice))
    .map(token => token.id);
}

/**
 * Check if landing at a new step captures any opponent token
 * @param {string} currentColor - color of moving player
 * @param {number} targetStep - relative target step of moving token
 * @param {Array} allPlayers - all player objects
 * @returns {Array<{ playerIndex: number, tokenIndex: number }>} captured token references
 */
export function checkCapture(currentColor, targetStep, allPlayers) {
  // Captures only occur on the common 52-cell track (step 0..50)
  if (targetStep < 0 || targetStep > MAX_TRACK_STEP) {
    return [];
  }

  const targetGlobalIdx = getGlobalTrackIndex(currentColor, targetStep);
  if (targetGlobalIdx === null) return [];

  // Safe cells cannot be captured
  if (isGlobalTrackSafe(targetGlobalIdx)) {
    return [];
  }

  const captures = [];

  allPlayers.forEach((player, pIdx) => {
    if (player.color === currentColor) return; // Cannot capture own tokens

    player.tokens.forEach((t, tIdx) => {
      if (t.step >= 0 && t.step <= MAX_TRACK_STEP) {
        const opponentGlobalIdx = getGlobalTrackIndex(player.color, t.step);
        if (opponentGlobalIdx === targetGlobalIdx) {
          captures.push({ playerIndex: pIdx, tokenIndex: tIdx });
        }
      }
    });
  });

  return captures;
}

/**
 * Check if a player has achieved victory (all 4 tokens reached home step 56)
 * @param {Array} tokens
 * @returns {boolean}
 */
export function hasPlayerWon(tokens) {
  if (!tokens || tokens.length === 0) return false;
  return tokens.every(token => token.step === WINNING_STEP);
}

/**
 * Count how many tokens have reached home
 */
export function getHomeCount(tokens) {
  if (!tokens) return 0;
  return tokens.filter(t => t.step === WINNING_STEP).length;
}
