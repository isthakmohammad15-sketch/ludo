import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Lobby from './pages/Lobby';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { sound } from './game/sound';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeGameConfig, setActiveGameConfig] = useState(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ludo_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.log(e);
    }
    // Default initial account
    return {
      id: 'u-alex',
      username: 'AlexMercer',
      email: 'alex@arena.ludo',
      avatar: '🦊',
      level: 14,
      xp: 3450,
      gamesPlayed: 86,
      gamesWon: 53,
      tokensCaptured: 194,
      tokensLost: 112,
      points: 3450,
    };
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ludo_auth_user', JSON.stringify(user));
    } catch (e) {
      console.log(e);
    }
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ludo_auth_user');
    } catch (e) {
      console.log(e);
    }
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleUpdateUser = (updated) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('ludo_auth_user', JSON.stringify(updated));
    } catch (e) {
      console.log(e);
    }
  };

  const handleToggleSfx = () => {
    const nextVal = !sfxEnabled;
    setSfxEnabled(nextVal);
    sound.setSfxEnabled(nextVal);
  };

  // Launch a game
  const handleStartGame = (config) => {
    setActiveGameConfig(config);
    setCurrentPage('game');
  };

  // Navigate to lobby
  const handleNavigateToLobby = (lobbyConfig) => {
    setActiveGameConfig(lobbyConfig);
    setCurrentPage('lobby');
  };

  // Join existing room
  const handleJoinRoom = (roomId) => {
    setActiveGameConfig({ roomId, mode: 'online', isHost: false, playerCount: 4 });
    setCurrentPage('lobby');
  };

  // Exit game to main menu
  const handleExitToMenu = () => {
    setActiveGameConfig(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-['Outfit',sans-serif] selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Global Navigation Header (hide during active game for maximum board space) */}
      {currentPage !== 'game' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          sfxEnabled={sfxEnabled}
          onToggleSfx={handleToggleSfx}
          currentUser={currentUser}
          onOpenLogin={() => setCurrentPage('login')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <Home
            currentUser={currentUser}
            onStartGame={handleStartGame}
            onNavigateToLobby={handleNavigateToLobby}
            onJoinRoom={handleJoinRoom}
          />
        )}

        {currentPage === 'login' && (
          <Login
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'game' && activeGameConfig && (
          <Game
            gameConfig={activeGameConfig}
            currentUser={currentUser}
            onExitToMenu={handleExitToMenu}
          />
        )}

        {currentPage === 'lobby' && (
          <Lobby
            roomId={activeGameConfig?.roomId}
            isHost={activeGameConfig?.isHost ?? true}
            playerCount={activeGameConfig?.playerCount ?? 4}
            currentUser={currentUser || { id: 'guest-1', username: 'GuestPlayer', avatar: '🦊' }}
            onStartGame={handleStartGame}
            onLeave={handleExitToMenu}
          />
        )}

        {currentPage === 'profile' && (
          <Profile
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'leaderboard' && (
          <Leaderboard currentUser={currentUser} />
        )}

        {currentPage === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Footer (only on landing / non-game pages) */}
      {currentPage !== 'game' && currentPage !== 'login' && (
        <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 bg-[#060910]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-bold text-slate-400">Ludo Arena</span>
              <span>— Live Real-Time Multiplayer Board Game</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                type="button"
                onClick={() => setCurrentPage('settings')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Game Rules
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('leaderboard')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Rankings
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('profile')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                My Profile
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
