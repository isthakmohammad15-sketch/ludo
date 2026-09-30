import React, { useState, useEffect, useRef, useCallback } from 'react';
import LudoBoard from '../components/LudoBoard';
import Dice from '../components/Dice';
import PlayerPanel from '../components/PlayerPanel';
import Chat from '../components/Chat';
import GameHeader from '../components/GameHeader';
import GameControls from '../components/GameControls';
import WinnerModal from '../components/WinnerModal';
import RulesModal from '../components/RulesModal';
import { createInitialState, getNextPlayerIndex, INITIAL_TIMER_SECONDS } from '../game/gameState';
import { canTokenMove, getMovableTokenIds } from '../game/gameRules';
import { applyTokenMove } from '../game/movement';
import { getBestAIMove } from '../game/ai';
import { multiplayer } from '../game/multiplayer';
import { sound } from '../game/sound';
import { recordCompletedMatch } from '../game/api';

export default function Game({
  gameConfig = {},
  onExitToMenu,
  currentUser = null,
}) {
  const {
    mode = 'ai',
    playerCount = 4,
    roomId = null,
    customPlayers = null,
  } = gameConfig;


  // Initialize master state
  const [gameState, setGameState] = useState(() => {
    const initial = createInitialState({
      playerCount,
      mode,
      userName: 'You',
    });
    if (customPlayers && customPlayers.length > 0) {
      initial.players = customPlayers;
      initial.playerCount = customPlayers.length;
    }
    return initial;
  });

  const [rulesOpen, setRulesOpen] = useState(false);
  const [turnTicker, setTurnTicker] = useState('Game started! Red rolls first.');
  const aiTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const activePlayer = gameState.players[gameState.activePlayerIndex] || {};
  const isHumanTurn = !activePlayer.isBot;
  const isMyTurn = mode === 'online'
    ? (activePlayer.id === currentUser?.id || activePlayer.name === currentUser?.username)
    : isHumanTurn;
  const isFinished = !!gameState.winner;

  // Sound and settings toggles
  const handleToggleSfx = () => {
    const nextVal = !gameState.settings.sfx;
    sound.setSfxEnabled(nextVal);
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, sfx: nextVal },
    }));
  };

  const handleToggleMusic = () => {
    const nextVal = !gameState.settings.music;
    sound.setMusicEnabled(nextVal);
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, music: nextVal },
    }));
  };

  const handleToggleSpeed = () => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        speed: prev.settings.speed === 'normal' ? 'fast' : 'normal',
      },
    }));
  };

  // Turn timer interval
  useEffect(() => {
    if (isFinished || gameState.isPaused) return;

    timerIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timer <= 1) {
          // Timer expired: handle auto-action
          return { ...prev, timer: 0 };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [gameState.activePlayerIndex, gameState.turnState, isFinished, gameState.isPaused]);

  // Handle timer expiry (auto-pass or auto-roll)
  useEffect(() => {
    if (gameState.timer === 0 && !isFinished) {
      if (gameState.turnState === 'rolling') {
        handleRollDice();
      } else if (gameState.turnState === 'moving') {
        // Auto pick first movable token or pass
        if (gameState.movableTokenIds.length > 0) {
          handleSelectToken(gameState.movableTokenIds[0]);
        } else {
          passTurnToNextPlayer(gameState.players, gameState.activePlayerIndex);
        }
      }
    }
  }, [gameState.timer]);

  // Turn announcement message generator
  useEffect(() => {
    if (!activePlayer.name) return;
    if (gameState.turnState === 'rolling') {
      setTurnTicker(`${activePlayer.avatar} ${activePlayer.name}'s Turn — Roll the dice!`);
    } else if (gameState.turnState === 'moving') {
      const count = gameState.movableTokenIds.length;
      if (count === 0) {
        setTurnTicker(`${activePlayer.name} rolled a ${gameState.diceValue} — No valid moves.`);
      } else {
        setTurnTicker(`${activePlayer.name} rolled a ${gameState.diceValue} — Select a token to move!`);
      }
    }
  }, [gameState.activePlayerIndex, gameState.turnState, gameState.diceValue]);

  // Multiplayer real-time sync listeners
  useEffect(() => {
    if (mode !== 'online' || !roomId) return;

    const unsubRoll = multiplayer.on('dice-rolled', ({ dice, playerIndex }) => {
      executeDiceRoll(dice, playerIndex);
    });

    const unsubMove = multiplayer.on('token-moved', ({ tokenIndex, playerIndex }) => {
      executeTokenMove(tokenIndex, playerIndex);
    });

    const unsubChat = multiplayer.on('chat-message', (msg) => {
      setGameState(prev => ({
        ...prev,
        chat: [...prev.chat, msg],
      }));
    });

    return () => {
      unsubRoll();
      unsubMove();
      unsubChat();
    };
  }, [mode, roomId]);

  // Core Dice Roll Action
  const executeDiceRoll = (rolledNumber, playerIdx) => {
    sound.playDiceRoll();

    setGameState(prev => {
      const player = prev.players[playerIdx];
      const movableIds = getMovableTokenIds(player.tokens, rolledNumber);
      const isSix = rolledNumber === 6;
      const nextConsecutive = isSix ? prev.consecutiveSixes + 1 : 0;

      // Rule: 3 consecutive sixes penalty
      const isThreeSixesPenalty = nextConsecutive >= 3;

      return {
        ...prev,
        diceValue: rolledNumber,
        isRolling: false,
        turnState: 'moving',
        consecutiveSixes: isThreeSixesPenalty ? 0 : nextConsecutive,
        movableTokenIds: isThreeSixesPenalty ? [] : movableIds,
        history: [
          {
            id: Date.now().toString(),
            text: `🎲 ${player.name} rolled a ${rolledNumber}${isSix ? ' (+1 roll)' : ''}`,
            timestamp: Date.now(),
          },
          ...prev.history,
        ],
      };
    });

    if (rolledNumber === 6) {
      sound.playSixRoll();
    }
  };

  const handleRollDice = () => {
    if (gameState.turnState !== 'rolling' || gameState.isRolling || isFinished) return;

    const rolledNumber = Math.floor(Math.random() * 6) + 1;

    setGameState(prev => ({ ...prev, isRolling: true }));

    // If multiplayer, broadcast roll to other tabs
    if (mode === 'online' && roomId) {
      multiplayer.broadcast('dice-rolled', {
        dice: rolledNumber,
        playerIndex: gameState.activePlayerIndex,
      });
    }

    setTimeout(() => {
      executeDiceRoll(rolledNumber, gameState.activePlayerIndex);
    }, 700);
  };

  // Pass turn helper
  const passTurnToNextPlayer = useCallback((currentPlayers, currentIndex, bonusTurn = false) => {
    setGameState(prev => {
      const nextIdx = bonusTurn
        ? currentIndex
        : getNextPlayerIndex(currentIndex, currentPlayers, prev.rankings);

      return {
        ...prev,
        activePlayerIndex: nextIdx,
        turnState: 'rolling',
        diceValue: null,
        movableTokenIds: [],
        timer: INITIAL_TIMER_SECONDS,
      };
    });
  }, []);

  // Core Token Move Action
  const executeTokenMove = (tokenIndex, playerIdx) => {
    setGameState(prev => {
      if (playerIdx !== prev.activePlayerIndex) return prev;

      const result = applyTokenMove(prev, tokenIndex);
      if (!result) return prev;

      const { nextPlayers, hasBonusTurn, isWinner, logMessage } = result;

      let nextWinner = prev.winner;
      const nextRankings = [...prev.rankings];

      if (isWinner && !nextWinner) {
        nextWinner = nextPlayers[playerIdx];
        nextRankings.push(nextWinner);

        // Record real completed match in backend database
        recordCompletedMatch({
          winnerId: nextWinner.id,
          winnerColor: nextWinner.color,
          mode,
          participants: nextPlayers.map((p, idx) => ({
            userId: p.id,
            name: p.name,
            color: p.color,
            captured: p.stats?.captured || 0,
            lost: p.stats?.lost || 0,
            rank: p.id === nextWinner.id ? '1st' : `${idx + 1}th`,
          })),
        }).catch(e => console.warn('Record match error:', e));
      }

      // Delay turn progression slightly to allow move animation
      setTimeout(() => {
        if (!nextWinner) {
          passTurnToNextPlayer(nextPlayers, playerIdx, hasBonusTurn);
        }
      }, prev.settings.speed === 'fast' ? 300 : 600);

      return {
        ...prev,
        players: nextPlayers,
        turnState: 'animating',
        winner: nextWinner,
        rankings: nextRankings,
        movableTokenIds: [],
        history: [
          { id: Date.now().toString(), text: logMessage, timestamp: Date.now() },
          ...prev.history,
        ],
      };
    });
  };

  const handleSelectToken = (tokenIndex) => {
    if (gameState.turnState !== 'moving' || isFinished) return;
    if (mode === 'online' && !isMyTurn) return;
    if (!gameState.movableTokenIds.includes(tokenIndex)) return;

    if (mode === 'online' && roomId) {
      multiplayer.moveToken(tokenIndex, gameState.activePlayerIndex);
    }

    executeTokenMove(tokenIndex, gameState.activePlayerIndex);
  };

  // AI Turn Handler
  useEffect(() => {
    if (isFinished || isHumanTurn) return;

    // AI is rolling
    if (gameState.turnState === 'rolling' && !gameState.isRolling) {
      aiTimeoutRef.current = setTimeout(() => {
        handleRollDice();
      }, 750);
    }

    // AI has rolled, needs to move
    if (gameState.turnState === 'moving') {
      const movable = gameState.movableTokenIds;

      if (movable.length === 0) {
        // No moves: pass turn after short pause
        aiTimeoutRef.current = setTimeout(() => {
          passTurnToNextPlayer(gameState.players, gameState.activePlayerIndex, false);
        }, 1000);
      } else {
        // Pick best heuristic move
        aiTimeoutRef.current = setTimeout(() => {
          const chosenToken = getBestAIMove(activePlayer, gameState.diceValue, gameState.players);
          if (chosenToken !== null) {
            handleSelectToken(chosenToken);
          } else {
            handleSelectToken(movable[0]);
          }
        }, 850);
      }
    }

    return () => clearTimeout(aiTimeoutRef.current);
  }, [gameState.activePlayerIndex, gameState.turnState, gameState.isRolling, isHumanTurn, isFinished]);

  // Auto-advance if human has no legal moves
  useEffect(() => {
    if (isHumanTurn && gameState.turnState === 'moving' && gameState.movableTokenIds.length === 0) {
      const timer = setTimeout(() => {
        passTurnToNextPlayer(gameState.players, gameState.activePlayerIndex, false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, gameState.turnState, gameState.movableTokenIds.length]);

  // Chat message send handler
  const handleSendChatMessage = (text) => {
    const newMsg = {
      id: Date.now().toString(),
      sender: 'You',
      text,
      color: activePlayer.color || 'accent',
      timestamp: Date.now(),
    };

    setGameState(prev => ({
      ...prev,
      chat: [...prev.chat, newMsg],
    }));

    if (mode === 'online' && roomId) {
      multiplayer.broadcast('chat-message', newMsg);
    }
  };

  // Restart match handler
  const handleRestart = () => {
    const refreshed = createInitialState({
      playerCount,
      mode,
      userName: 'You',
    });
    setGameState(refreshed);
    setTurnTicker('Match restarted! Red rolls first.');
  };

  // Divide players into corners
  const redPlayer = gameState.players.find(p => p.color === 'red');
  const greenPlayer = gameState.players.find(p => p.color === 'green');
  const yellowPlayer = gameState.players.find(p => p.color === 'yellow');
  const bluePlayer = gameState.players.find(p => p.color === 'blue');

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-5 flex flex-col gap-4">
      {/* 1. Game Header */}
      <GameHeader
        mode={mode}
        playerCount={gameState.players.length}
        roomId={roomId}
        turnMessage={turnTicker}
        onLeave={onExitToMenu}
      />

      {/* 2. Main Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Player Panels (Desktop) / Top panels */}
        <div className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1">
          {redPlayer && (
            <PlayerPanel
              player={redPlayer}
              isActive={activePlayer.color === 'red'}
              isClientTurn={isHumanTurn && activePlayer.color === 'red'}
            />
          )}
          {bluePlayer && (
            <PlayerPanel
              player={bluePlayer}
              isActive={activePlayer.color === 'blue'}
              isClientTurn={isHumanTurn && activePlayer.color === 'blue'}
            />
          )}

          {/* Quick Game Controls */}
          <div className="mt-2 hidden lg:block">
            <GameControls
              sfxEnabled={gameState.settings.sfx}
              musicEnabled={gameState.settings.music}
              speed={gameState.settings.speed}
              onToggleSfx={handleToggleSfx}
              onToggleMusic={handleToggleMusic}
              onToggleSpeed={handleToggleSpeed}
              onOpenRules={() => setRulesOpen(true)}
              onRestart={handleRestart}
              onLeave={onExitToMenu}
            />
          </div>
        </div>

        {/* Center Column: The Master 15x15 Ludo Board */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4 order-1 lg:order-2 w-full">
          <LudoBoard
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
            movableTokenIds={gameState.movableTokenIds}
            onTokenClick={handleSelectToken}
            diceValue={gameState.diceValue}
          />

          {/* Mobile/Tablet Controls Bar */}
          <div className="w-full max-w-[580px] lg:hidden flex justify-between items-center gap-2">
            <GameControls
              sfxEnabled={gameState.settings.sfx}
              musicEnabled={gameState.settings.music}
              speed={gameState.settings.speed}
              onToggleSfx={handleToggleSfx}
              onToggleMusic={handleToggleMusic}
              onToggleSpeed={handleToggleSpeed}
              onOpenRules={() => setRulesOpen(true)}
              onRestart={handleRestart}
              onLeave={onExitToMenu}
            />
          </div>
        </div>

        {/* Right Column: Other Players + Dice Tray + Chat */}
        <div className="lg:col-span-3 flex flex-col gap-3 order-3">
          {greenPlayer && (
            <PlayerPanel
              player={greenPlayer}
              isActive={activePlayer.color === 'green'}
              isClientTurn={isHumanTurn && activePlayer.color === 'green'}
            />
          )}
          {yellowPlayer && (
            <PlayerPanel
              player={yellowPlayer}
              isActive={activePlayer.color === 'yellow'}
              isClientTurn={isHumanTurn && activePlayer.color === 'yellow'}
            />
          )}

          {/* 3D Dice Tray */}
          <div className="flex justify-center my-1">
            <Dice
              value={gameState.diceValue || 6}
              isRolling={gameState.isRolling}
              canRoll={isMyTurn && gameState.turnState === 'rolling' && !isFinished}
              onRoll={handleRollDice}
              activeColor={activePlayer.color || 'red'}
              playerName={activePlayer.name || 'Player'}
              timer={gameState.timer}
              maxTimer={INITIAL_TIMER_SECONDS}
            />
          </div>

          {/* In-Game Live Chat Panel */}
          <Chat
            messages={gameState.chat}
            onSendMessage={handleSendChatMessage}
            currentUserColor={activePlayer.color}
            currentUserName={currentUser?.username || 'You'}
          />
        </div>
      </div>

      {/* Rules Modal */}
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />

      {/* Winner Celebration Modal */}
      <WinnerModal
        winner={gameState.winner}
        players={gameState.players}
        onRestart={handleRestart}
        onExit={onExitToMenu}
      />
    </div>
  );
}
