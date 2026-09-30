import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed users if file doesn't exist
const DEFAULT_USERS = [
  {
    id: 'u-alex',
    username: 'AlexMercer',
    email: 'alex@arena.ludo',
    password: 'password123',
    avatar: '🦊',
    level: 14,
    xp: 3450,
    gamesPlayed: 86,
    gamesWon: 53,
    tokensCaptured: 194,
    tokensLost: 112,
    points: 3450,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u-valkyrie',
    username: 'ValkyriePrime',
    email: 'valk@arena.ludo',
    password: 'password123',
    avatar: '👑',
    level: 42,
    xp: 14850,
    gamesPlayed: 320,
    gamesWon: 245,
    tokensCaptured: 890,
    tokensLost: 310,
    points: 14850,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u-neon',
    username: 'NeonPhantom',
    email: 'neon@arena.ludo',
    password: 'password123',
    avatar: '⚡',
    level: 38,
    xp: 12900,
    gamesPlayed: 290,
    gamesWon: 204,
    tokensCaptured: 720,
    tokensLost: 280,
    points: 12900,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u-dragon',
    username: 'DragonSlayer',
    email: 'dragon@arena.ludo',
    password: 'password123',
    avatar: '🐉',
    level: 35,
    xp: 11450,
    gamesPlayed: 260,
    gamesWon: 178,
    tokensCaptured: 640,
    tokensLost: 245,
    points: 11450,
    createdAt: new Date().toISOString(),
  },
];

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2));
    return DEFAULT_USERS;
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users file:', err);
  }
}

function loadMatches() {
  if (!fs.existsSync(MATCHES_FILE)) {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(MATCHES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading matches file:', err);
    return [];
  }
}

function saveMatches(matches) {
  try {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
  } catch (err) {
    console.error('Error saving matches file:', err);
  }
}

// In-memory real-time rooms
const activeRooms = new Map();
const PLAYER_COLORS = ['red', 'green', 'yellow', 'blue'];

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ======================== REST API ROUTES ========================

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, avatar = '🦊' } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }

  const users = loadUsers();
  const existing = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(409).json({ error: 'Username or email already in use' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password, // For production use bcrypt; plain for local demo server
    avatar,
    level: 1,
    xp: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    tokensCaptured: 0,
    tokensLost: 0,
    points: 0,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = loadUsers();
  const user = users.find(
    u => (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

// Quick Guest Login
app.post('/api/auth/guest', (req, res) => {
  const { username = `Player_${Math.floor(1000 + Math.random() * 9000)}`, avatar = '🦊' } = req.body;
  const users = loadUsers();

  const guestUser = {
    id: `guest-${Date.now()}`,
    username,
    email: `${username.toLowerCase()}@guest.ludo`,
    avatar,
    level: 1,
    xp: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    tokensCaptured: 0,
    tokensLost: 0,
    points: 0,
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  users.push(guestUser);
  saveUsers(users);

  res.json({ user: guestUser });
});

// Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const users = loadUsers();
  const sorted = [...users]
    .map(u => ({
      id: u.id,
      name: u.username,
      avatar: u.avatar,
      level: u.level || 1,
      games: u.gamesPlayed || 0,
      wins: u.gamesWon || 0,
      winRate: u.gamesPlayed ? Math.round((u.gamesWon / u.gamesPlayed) * 1000) / 10 : 0,
      points: u.points || 0,
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  res.json({ leaderboard: sorted });
});

// Record Completed Match
app.post('/api/matches/record', (req, res) => {
  const { winnerId, winnerColor, mode, participants = [] } = req.body;
  const users = loadUsers();
  const matches = loadMatches();

  const matchRecord = {
    id: `m-${Date.now()}`,
    date: new Date().toISOString(),
    mode: mode || 'Multiplayer',
    winnerId,
    winnerColor,
    participants: participants.map(p => ({
      userId: p.userId,
      name: p.name,
      color: p.color,
      captured: p.captured || 0,
      lost: p.lost || 0,
      rank: p.rank || (p.userId === winnerId ? '1st' : '2nd'),
      isWinner: p.userId === winnerId,
    })),
  };

  matches.unshift(matchRecord);
  saveMatches(matches.slice(0, 100)); // retain last 100 matches

  // Update user stats
  participants.forEach(p => {
    if (!p.userId) return;
    const user = users.find(u => u.id === p.userId || u.username === p.name);
    if (user) {
      user.gamesPlayed = (user.gamesPlayed || 0) + 1;
      const isWinner = p.userId === winnerId;
      if (isWinner) {
        user.gamesWon = (user.gamesWon || 0) + 1;
        user.points = (user.points || 0) + 150;
        user.xp = (user.xp || 0) + 250;
      } else {
        user.points = (user.points || 0) + 40;
        user.xp = (user.xp || 0) + 80;
      }
      user.tokensCaptured = (user.tokensCaptured || 0) + (p.captured || 0);
      user.tokensLost = (user.tokensLost || 0) + (p.lost || 0);
      // Level progression: 1 level per 500 XP
      user.level = Math.max(1, Math.floor(user.xp / 500) + 1);
    }
  });

  saveUsers(users);
  res.json({ success: true, match: matchRecord });
});

// Get User Match History
app.get('/api/users/:id/matches', (req, res) => {
  const { id } = req.params;
  const matches = loadMatches();
  const userMatches = matches.filter(m => m.participants.some(p => p.userId === id));
  res.json({ matches: userMatches });
});

// Get Room Info
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = activeRooms.get(roomId.toUpperCase());
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ room: serializeRoom(room) });
});

function serializeRoom(room) {
  return {
    roomId: room.roomId,
    hostId: room.hostId,
    playerCount: room.playerCount,
    status: room.status,
    players: room.players,
  };
}

// ======================== REAL-TIME SOCKET.IO ========================

io.on('connection', (socket) => {
  let currentRoomId = null;

  // Create Room
  socket.on('create-room', ({ roomId, user, playerCount = 4 }) => {
    const formattedId = roomId.toUpperCase();
    currentRoomId = formattedId;
    socket.join(formattedId);

    const players = [
      {
        socketId: socket.id,
        userId: user.id,
        name: user.username || user.name || 'Player 1',
        avatar: user.avatar || '🦊',
        color: 'red',
        isHost: true,
        isReady: true,
        isBot: false,
      },
    ];

    // Initialize open slots
    for (let i = 1; i < playerCount; i++) {
      players.push({
        socketId: null,
        userId: null,
        name: 'Open Slot',
        avatar: '⏳',
        color: PLAYER_COLORS[i],
        isHost: false,
        isReady: false,
        isBot: false,
      });
    }

    const room = {
      roomId: formattedId,
      hostId: socket.id,
      playerCount,
      status: 'lobby',
      players,
    };

    activeRooms.set(formattedId, room);
    socket.emit('room-created', { room: serializeRoom(room) });
    io.to(formattedId).emit('room-updated', { room: serializeRoom(room) });
  });

  // Join Room
  socket.on('join-room', ({ roomId, user }) => {
    const formattedId = roomId.toUpperCase();
    const room = activeRooms.get(formattedId);

    if (!room) {
      return socket.emit('join-error', { message: `Room ${formattedId} not found` });
    }

    if (room.status === 'in-game') {
      return socket.emit('join-error', { message: 'Match is already in progress' });
    }

    // Check if user is already in room
    let slotIndex = room.players.findIndex(p => p.userId === user.id);
    if (slotIndex === -1) {
      // Find open slot
      slotIndex = room.players.findIndex(p => p.socketId === null && !p.isBot);
      if (slotIndex === -1) {
        return socket.emit('join-error', { message: 'Room is already full' });
      }
    }

    currentRoomId = formattedId;
    socket.join(formattedId);

    room.players[slotIndex] = {
      socketId: socket.id,
      userId: user.id,
      name: user.username || user.name || `Player ${slotIndex + 1}`,
      avatar: user.avatar || '🦊',
      color: PLAYER_COLORS[slotIndex],
      isHost: slotIndex === 0,
      isReady: true,
      isBot: false,
    };

    socket.emit('room-joined', { room: serializeRoom(room), assignedColor: PLAYER_COLORS[slotIndex] });
    io.to(formattedId).emit('room-updated', { room: serializeRoom(room) });
    io.to(formattedId).emit('chat-message', {
      id: Date.now().toString(),
      sender: 'System',
      text: `${user.username || user.name} joined the arena!`,
      timestamp: Date.now(),
    });
  });

  // Add / Remove AI Bot
  socket.on('add-bot', ({ roomId, slotIndex }) => {
    const room = activeRooms.get(roomId.toUpperCase());
    if (!room || room.hostId !== socket.id) return;

    if (slotIndex >= 0 && slotIndex < room.players.length) {
      const botNames = ['CyberBot', 'QuantumAI', 'ApexDroid', 'ValkyrieAI'];
      const color = PLAYER_COLORS[slotIndex];
      room.players[slotIndex] = {
        socketId: null,
        userId: `bot-${Date.now()}-${slotIndex}`,
        name: `${botNames[slotIndex % botNames.length]} (Bot)`,
        avatar: '🤖',
        color,
        isHost: false,
        isReady: true,
        isBot: true,
      };
      io.to(room.roomId).emit('room-updated', { room: serializeRoom(room) });
    }
  });

  // Toggle Ready
  socket.on('player-ready', ({ roomId, isReady }) => {
    const room = activeRooms.get(roomId.toUpperCase());
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.isReady = isReady;
      io.to(room.roomId).emit('room-updated', { room: serializeRoom(room) });
    }
  });

  // Start Game
  socket.on('start-game', ({ roomId, config }) => {
    const room = activeRooms.get(roomId.toUpperCase());
    if (!room || room.hostId !== socket.id) return;

    room.status = 'in-game';

    // Fill remaining empty slots with bots automatically
    room.players = room.players.map((p, idx) => {
      if (p.socketId === null && !p.isBot) {
        return {
          socketId: null,
          userId: `bot-${Date.now()}-${idx}`,
          name: `Bot ${idx + 1} (AI)`,
          avatar: '🤖',
          color: PLAYER_COLORS[idx],
          isHost: false,
          isReady: true,
          isBot: true,
        };
      }
      return p;
    });

    io.to(room.roomId).emit('game-started', {
      config: {
        mode: 'online',
        roomId: room.roomId,
        playerCount: room.players.length,
        customPlayers: room.players.map((p, idx) => ({
          id: p.userId || `p-${p.color}`,
          name: p.name,
          avatar: p.avatar,
          color: p.color,
          isHost: p.isHost,
          isBot: p.isBot,
          tokens: [
            { id: 0, step: -1 },
            { id: 1, step: -1 },
            { id: 2, step: -1 },
            { id: 3, step: -1 },
          ],
          stats: { captured: 0, lost: 0, sixesRolled: 0 },
        })),
      },
    });
  });

  // Real-time Action: Dice Roll
  socket.on('roll-dice', ({ roomId, dice, playerIndex, consecutiveSixes }) => {
    io.to(roomId.toUpperCase()).emit('dice-rolled', {
      dice,
      playerIndex,
      consecutiveSixes,
    });
  });

  // Real-time Action: Move Token
  socket.on('move-token', ({ roomId, tokenIndex, playerIndex }) => {
    io.to(roomId.toUpperCase()).emit('token-moved', {
      tokenIndex,
      playerIndex,
    });
  });

  // In-Game Live Chat
  socket.on('chat-message', ({ roomId, message }) => {
    io.to(roomId.toUpperCase()).emit('chat-message', message);
  });

  // Leave / Disconnect
  const handleLeave = () => {
    if (!currentRoomId) return;
    const room = activeRooms.get(currentRoomId);
    if (!room) return;

    const leavingPlayer = room.players.find(p => p.socketId === socket.id);
    if (leavingPlayer) {
      io.to(currentRoomId).emit('chat-message', {
        id: Date.now().toString(),
        sender: 'System',
        text: `${leavingPlayer.name} left the room.`,
        timestamp: Date.now(),
      });

      // Clear player's slot
      const idx = room.players.indexOf(leavingPlayer);
      room.players[idx] = {
        socketId: null,
        userId: null,
        name: 'Open Slot',
        avatar: '⏳',
        color: PLAYER_COLORS[idx],
        isHost: false,
        isReady: false,
        isBot: false,
      };

      // If host left, transfer host to next active connected human
      if (leavingPlayer.isHost) {
        const nextHost = room.players.find(p => p.socketId !== null);
        if (nextHost) {
          nextHost.isHost = true;
          room.hostId = nextHost.socketId;
        } else {
          // No human players left, delete room
          activeRooms.delete(currentRoomId);
          return;
        }
      }

      io.to(currentRoomId).emit('room-updated', { room: serializeRoom(room) });
    }
    socket.leave(currentRoomId);
    currentRoomId = null;
  };

  socket.on('leave-room', handleLeave);
  socket.on('disconnect', handleLeave);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Ludo Arena Real-Time WebSocket Server listening on http://localhost:${PORT}`);
});
