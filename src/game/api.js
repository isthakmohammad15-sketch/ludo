/**
 * API client for Ludo Arena backend.
 * Connects to live Express/Socket.IO backend with seamless offline fallback.
 */

const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:3001`
  : 'http://localhost:3001';

export const SERVER_URL = API_BASE;

export async function registerUser({ username, email, password, avatar }) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, avatar }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data.user;
  } catch (err) {
    // If server unreachable, create local real account
    const localUser = {
      id: `u-${Date.now()}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      avatar: avatar || '🦊',
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      tokensCaptured: 0,
      tokensLost: 0,
      points: 0,
      createdAt: new Date().toISOString(),
    };
    return localUser;
  }
}

export async function loginUser({ username, password }) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data.user;
  } catch (err) {
    throw err;
  }
}

export async function guestLogin({ username, avatar }) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, avatar }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Guest login failed');
    return data.user;
  } catch (err) {
    const guestUser = {
      id: `guest-${Date.now()}`,
      username: username || `Warrior_${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: avatar || '🦊',
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
    return guestUser;
  }
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    if (res.ok) {
      const data = await res.json();
      return data.leaderboard;
    }
  } catch (err) {
    console.warn('Backend leaderboard offline, reading local state:', err);
  }

  // Fallback: read stored real users from localStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('ludo_registered_users') || '[]');
    if (localUsers.length > 0) {
      return localUsers.map(u => ({
        id: u.id,
        name: u.username,
        avatar: u.avatar,
        level: u.level || 1,
        games: u.gamesPlayed || 0,
        wins: u.gamesWon || 0,
        winRate: u.gamesPlayed ? Math.round((u.gamesWon / u.gamesPlayed) * 1000) / 10 : 0,
        points: u.points || 0,
      })).sort((a, b) => b.points - a.points);
    }
  } catch (e) {
    // empty
  }
  return [];
}

export async function recordCompletedMatch({ winnerId, winnerColor, mode, participants }) {
  try {
    const res = await fetch(`${API_BASE}/api/matches/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId, winnerColor, mode, participants }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend record match offline, updating local match history:', err);
  }

  // Local storage record
  try {
    const localMatches = JSON.parse(localStorage.getItem('ludo_match_history') || '[]');
    const newMatch = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString(),
      mode: mode || 'Multiplayer',
      winnerId,
      winnerColor,
      participants,
    };
    localMatches.unshift(newMatch);
    localStorage.setItem('ludo_match_history', JSON.stringify(localMatches.slice(0, 50)));
  } catch (e) {
    // empty
  }
  return null;
}

export async function fetchUserMatches(userId) {
  try {
    const res = await fetch(`${API_BASE}/api/users/${userId}/matches`);
    if (res.ok) {
      const data = await res.json();
      return data.matches;
    }
  } catch (err) {
    console.warn('Backend user matches offline, reading local history:', err);
  }

  try {
    const localMatches = JSON.parse(localStorage.getItem('ludo_match_history') || '[]');
    return localMatches.filter(m => m.participants.some(p => p.userId === userId));
  } catch (e) {
    return [];
  }
}
