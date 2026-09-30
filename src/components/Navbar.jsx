import React, { useState } from 'react';
import { Gamepad2, Users, Trophy, User, Settings, Volume2, VolumeX, Menu, X, LogIn, LogOut, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';

export default function Navbar({
  currentPage = 'home',
  onNavigate,
  sfxEnabled = true,
  onToggleSfx,
  currentUser = null,
  onOpenLogin,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Play Arena', icon: Gamepad2 },
    { id: 'lobby', label: 'Live Rooms', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (pageId) => {
    sound.playClick();
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-[#0A0E1A] flex items-center justify-center p-1.5">
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
                <span className="rounded-sm bg-red-500" />
                <span className="rounded-sm bg-emerald-500" />
                <span className="rounded-sm bg-blue-500" />
                <span className="rounded-sm bg-amber-400" />
              </div>
            </div>
          </div>
          <div className="text-left">
            <div className="font-black text-lg sm:text-xl tracking-tight text-white leading-none">
              LUDO <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">ARENA</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <span>Live Multiplayer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`
                  flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleSfx();
            }}
            title={sfxEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => handleNav('profile')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 transition-all cursor-pointer"
              title="View Profile"
            >
              <span className="text-lg">{currentUser.avatar || '🦊'}</span>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[90px]">
                  {currentUser.username}
                </span>
                <span className="text-[9px] text-amber-300 font-extrabold uppercase">
                  Lvl {currentUser.level || 1}
                </span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenLogin();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left
                  ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {!currentUser && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-md text-left"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
