/**
 * Real-time Multiplayer Engine for Ludo Arena.
 * Supports:
 * 1. BroadcastChannel / LocalStorage cross-tab synchronization for instant testing
 * 2. Socket.io client integration when connected to a backend server
 */
import { io } from 'socket.io-client';

export class MultiplayerService {
  constructor() {
    this.roomId = null;
    this.playerId = null;
    this.broadcastChannel = null;
    this.socket = null;
    this.listeners = new Map();
  }

  generateRoomId() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `LUDO-${code}`;
  }

  joinRoom(roomId, playerInfo, serverUrl = null) {
    this.leaveRoom();
    this.roomId = roomId;
    this.playerId = playerInfo.id;

    // 1. Setup BroadcastChannel for browser-to-browser cross-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(`ludo-arena-room-${roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          const { type, payload, senderId } = event.data;
          if (senderId !== this.playerId) {
            this.emit(type, payload);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or blocked:', err);
      }
    }

    // 2. Setup Socket.IO if backend server is available
    if (serverUrl) {
      try {
        this.socket = io(serverUrl, { transports: ['websocket'] });
        this.socket.emit('join-room', { roomId, playerInfo });

        this.socket.on('game-event', ({ type, payload }) => {
          this.emit(type, payload);
        });
      } catch (err) {
        console.warn('Socket.IO connection error:', err);
      }
    }

    // Announce join
    this.broadcast('player-joined', { player: playerInfo });
  }

  broadcast(type, payload) {
    // Via BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type,
        payload,
        senderId: this.playerId,
      });
    }

    // Via Socket.IO
    if (this.socket && this.socket.connected) {
      this.socket.emit('game-event', {
        roomId: this.roomId,
        type,
        payload,
      });
    }
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
    if (this.broadcastChannel) {
      this.broadcast('player-left', { playerId: this.playerId });
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomId = null;
  }
}

export const multiplayer = new MultiplayerService();
