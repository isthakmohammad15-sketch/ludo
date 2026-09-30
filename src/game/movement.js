/**
 * Movement calculations and animation path resolvers for Ludo tokens.
 */
import { WINNING_STEP, checkCapture } from './gameRules.js';
import { getGlobalTrackIndex, isGlobalTrackSafe } from './coordinates.js';
import { sound } from './sound.js';


/**
 * Compute the sequence of intermediate step numbers for smooth cell-by-cell animation
 * @param {number} currentStep
 * @param {number} diceValue
 * @returns {number[]} array of steps
 */
export function calculateStepPath(currentStep, diceValue) {
  if (currentStep === -1) {
    // Coming out of home yard directly to start square 0
    return [0];
  }

  const path = [];
  const target = Math.min(WINNING_STEP, currentStep + diceValue);
  for (let s = currentStep + 1; s <= target; s++) {
    path.push(s);
  }
  return path;
}

/**
 * Apply a move to a player's token, resolving captures, bonus rolls, and win condition.
 * @param {Object} state - current game state
 * @param {number} tokenIndex - token to move (0..3)
 * @returns {Object} { nextPlayers, captures, hasBonusTurn, reachedHome, isWinner, logMessage }
 */
export function applyTokenMove(state, tokenIndex) {
  const { players, activePlayerIndex, diceValue } = state;
  const activePlayer = players[activePlayerIndex];
  const token = activePlayer.tokens[tokenIndex];

  if (!token || !diceValue) return null;

  const currentStep = token.step;
  const targetStep = currentStep === -1 ? 0 : currentStep + diceValue;

  if (targetStep > WINNING_STEP) return null; // Illegal move

  // Deep clone players array
  const nextPlayers = players.map(p => ({
    ...p,
    tokens: p.tokens.map(t => ({ ...t })),
    stats: { ...p.stats },
  }));

  const movingPlayer = nextPlayers[activePlayerIndex];
  movingPlayer.tokens[tokenIndex].step = targetStep;

  let reachedHome = false;
  let captures = [];
  let logMessage = '';

  if (targetStep === WINNING_STEP) {
    reachedHome = true;
    sound.playHomeIn();
    logMessage = `🎯 ${movingPlayer.name}'s token reached Home!`;
  } else if (targetStep >= 0 && targetStep <= 50) {
    // Check capture
    captures = checkCapture(movingPlayer.color, targetStep, nextPlayers);
    if (captures.length > 0) {
      sound.playCapture();
      captures.forEach(({ playerIndex, tokenIndex: oppTokenIdx }) => {
        const victimPlayer = nextPlayers[playerIndex];
        victimPlayer.tokens[oppTokenIdx].step = -1; // Send back home
        victimPlayer.stats.lost = (victimPlayer.stats.lost || 0) + 1;
        movingPlayer.stats.captured = (movingPlayer.stats.captured || 0) + 1;
        logMessage = `💥 ${movingPlayer.name} captured ${victimPlayer.name}'s token!`;
      });
    } else {
      const gIdx = getGlobalTrackIndex(movingPlayer.color, targetStep);
      if (gIdx !== null && isGlobalTrackSafe(gIdx)) {
        sound.playSafeLanding();
        logMessage = `🛡️ ${movingPlayer.name} reached a Safe Zone.`;
      } else {
        sound.playTokenMove();
        if (currentStep === -1) {
          logMessage = `🚀 ${movingPlayer.name} brought a token onto the track!`;
        } else {
          logMessage = `🎲 ${movingPlayer.name} moved a token ${diceValue} steps.`;
        }
      }
    }
  } else {
    sound.playTokenMove();
    logMessage = `✨ ${movingPlayer.name} entered the Home Stretch!`;
  }

  // Bonus turns granted if:
  // 1. Rolled a 6 (provided consecutive sixes < 3)
  // 2. Captured an opponent token
  // 3. Reached home
  const hasBonusTurn = (diceValue === 6 && state.consecutiveSixes < 3) || captures.length > 0 || reachedHome;

  // Check if player won
  const isWinner = movingPlayer.tokens.every(t => t.step === WINNING_STEP);
  if (isWinner) {
    sound.playVictory();
    logMessage = `🏆 ${movingPlayer.name} WON THE GAME!`;
  }

  return {
    nextPlayers,
    captures,
    hasBonusTurn,
    reachedHome,
    isWinner,
    logMessage,
    targetStep,
  };
}
