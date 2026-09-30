/**
 * Smart AI heuristic decision engine for Computer Ludo opponents.
 */
import { getMovableTokenIds, checkCapture, WINNING_STEP, MAX_TRACK_STEP } from './gameRules.js';
import { getGlobalTrackIndex, isGlobalTrackSafe } from './coordinates.js';

/**
 * Pick the best legal token to move for an AI player
 * @param {Object} aiPlayer
 * @param {number} diceValue
 * @param {Array} allPlayers
 * @returns {number|null} tokenIndex (0..3) or null if no legal move
 */
export function getBestAIMove(aiPlayer, diceValue, allPlayers) {
  const movableIds = getMovableTokenIds(aiPlayer.tokens, diceValue);
  if (movableIds.length === 0) return null;
  if (movableIds.length === 1) return movableIds[0];

  let bestTokenId = movableIds[0];
  let highestScore = -Infinity;

  movableIds.forEach(tokenId => {
    const token = aiPlayer.tokens[tokenId];
    let score = 0;

    // Moving out of yard
    if (token.step === -1) {
      score += 650;
      // Bonus if yard has all 4 tokens stuck
      const tokensInYard = aiPlayer.tokens.filter(t => t.step === -1).length;
      score += tokensInYard * 50;
    } else {
      const targetStep = token.step + diceValue;

      // 1. Reaching home
      if (targetStep === WINNING_STEP) {
        score += 2000;
      }

      // 2. Entering home stretch
      if (token.step <= MAX_TRACK_STEP && targetStep > MAX_TRACK_STEP) {
        score += 700;
      }

      // 3. Capturing an opponent
      if (targetStep <= MAX_TRACK_STEP) {
        const captures = checkCapture(aiPlayer.color, targetStep, allPlayers);
        if (captures.length > 0) {
          score += 1200 + captures.length * 300;
        }

        const targetGlobalIdx = getGlobalTrackIndex(aiPlayer.color, targetStep);

        // 4. Landing on a safe cell
        if (targetGlobalIdx !== null && isGlobalTrackSafe(targetGlobalIdx)) {
          score += 450;
        }

        // 5. Escaping danger (check if opponent was behind current token)
        const currentGlobalIdx = getGlobalTrackIndex(aiPlayer.color, token.step);
        if (currentGlobalIdx !== null && !isGlobalTrackSafe(currentGlobalIdx)) {
          const threatened = isCellThreatened(currentGlobalIdx, aiPlayer.color, allPlayers);
          if (threatened) {
            score += 500; // Urgent escape!
          }
        }

        // 6. Risk of getting captured on destination
        if (targetGlobalIdx !== null && !isGlobalTrackSafe(targetGlobalIdx)) {
          const willBeThreatened = isCellThreatened(targetGlobalIdx, aiPlayer.color, allPlayers);
          if (willBeThreatened) {
            score -= 200;
          }
        }
      }

      // 7. General forward progress bonus
      score += targetStep * 4;
    }

    // Add a tiny random jitter for natural play
    score += Math.random() * 15;

    if (score > highestScore) {
      highestScore = score;
      bestTokenId = tokenId;
    }
  });

  return bestTokenId;
}

/**
 * Check if a cell is threatened by any opponent token 1..6 steps behind it
 */
function isCellThreatened(targetGlobalIdx, myColor, allPlayers) {
  for (const player of allPlayers) {
    if (player.color === myColor) continue;

    for (const t of player.tokens) {
      if (t.step >= 0 && t.step <= MAX_TRACK_STEP) {
        const oppGlobalIdx = getGlobalTrackIndex(player.color, t.step);
        if (oppGlobalIdx !== null) {
          // Distance in clockwise loop
          const dist = (targetGlobalIdx - oppGlobalIdx + 52) % 52;
          if (dist >= 1 && dist <= 6) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
