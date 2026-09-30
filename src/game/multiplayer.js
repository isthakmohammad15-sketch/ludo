/**
 * Real-time Multiplayer Engine for Ludo Arena.
 * Uses Socket.IO connected to backend server (http://localhost:3001)
 * with transparent BroadcastChannel fallback.
 */
import { io } from 'socket.io-client';
import { SERVER_URL } from './api';

export class MultiplayerService {
  constructor() {
    this.roomId = null;
    this.playerId = null;
    this.user = null;
    this.broadcastChannel = null;
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  generateRoomId() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `LUDO-${code}`;
  }

  initSocket() {
    if (!this.socket) {
      try {
        this.socket = io(SERVER_URL, {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          timeout: 5000,
        });

        this.socket.on('connect', () => {
          this.isConnected = true;
          this.emit('connection-status', { connected: true });
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
          this.emit('connection-status', { connected: false });
        });

        this.socket.on('room-created', (data) => this.emit('room-created', data));
        this.socket.on('room-joined', (data) => this.emit('room-joined', data));
        this.socket.on('room-updated', (data) => this.emit('room-updated', data));
        this.socket.on('join-error', (data) => this.emit('join-error', data));
        this.socket.on('game-started', (data) => this.emit('game-started', data));
        this.socket.on('dice-rolled', (data) => this.emit('dice-rolled', data));
        this.socket.on('token-moved', (data) => this.emit('token-moved', data));
        this.socket.on('chat-message', (data) => this.emit('chat-message', data));
      } catch (err) {
        console.warn('Socket connection error, using local channel:', err);
      }
    }
  }

  createRoom(roomId, user, playerCount = 4) {
    this.roomId = roomId.toUpperCase();
    this.user = user;
    this.playerId = user.id;

    this.initSocket();
    this.setupBroadcastChannel(this.roomId);

    if (this.socket && this.socket.connected) {
      this.socket.emit('create-room', {
        roomId: this.roomId,
        user,
        playerCount,
      });
    } else {
      // Local fallback
      this.broadcast('room-created', {
        room: {
          roomId: this.roomId,
          hostId: user.id,
          playerCount,
          players: [
            {
              socketId: null,
              userId: user.id,
              name: user.username || 'You',
              avatar: user.avatar || '🦊',
              color: 'red',
              isHost: true,
              isReady: true,
              isBot: false,
            },
          ],
        },
      });
    }
  }

  joinRoom(roomId, user) {
    this.roomId = roomId.toUpperCase();
    this.user = user;
    this.playerId = user.id;

    this.initSocket();
    this.setupBroadcastChannel(this.roomId);

    if (this.socket && this.socket.connected) {
      this.socket.emit('join-room', {
        roomId: this.roomId,
        user,
      });
    } else {
      // Fallback
      this.broadcast('player-joined', { player: user });
    }
  }

  setupBroadcastChannel(roomId) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        if (this.broadcastChannel) this.broadcastChannel.close();
        this.broadcastChannel = new BroadcastChannel(`ludo-arena-room-${roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          const { type, payload, senderId } = event.data;
          if (senderId !== this.playerId) {
            this.emit(type, payload);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  addBot(slotIndex) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('add-bot', { roomId: this.roomId, slotIndex });
    }
  }

  setReady(isReady) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('player-ready', { roomId: this.roomId, isReady });
    }
  }

  startGame(config) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('start-game', { roomId: this.roomId, config });
    } else {
      this.broadcast('game-started', { config });
    }
  }

  rollDice(dice, playerIndex, consecutiveSixes = 0) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('roll-dice', {
        roomId: this.roomId,
        dice,
        playerIndex,
        consecutiveSixes,
      });
    } else {
      this.broadcast('dice-rolled', { dice, playerIndex, consecutiveSixes });
    }
  }

  moveToken(tokenIndex, playerIndex) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('move-token', {
        roomId: this.roomId,
        tokenIndex,
        playerIndex,
      });
    } else {
      this.broadcast('token-moved', { tokenIndex, playerIndex });
    }
  }

  sendChatMessage(message) {
    if (this.socket && this.socket.connected && this.roomId) {
      this.socket.emit('chat-message', {
        roomId: this.roomId,
        message,
      });
    } else {
      this.broadcast('chat-message', message);
    }
  }

  broadcast(type, payload) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type,
        payload,
        senderId: this.playerId,
      });
    }
    this.emit(type, payload);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  leaveRoom() {
    if (this.socket && this.roomId) {
      this.socket.emit('leave-room');
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.roomId = null;
  }
}

export const multiplayer = new MultiplayerService();
