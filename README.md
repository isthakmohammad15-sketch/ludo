# 🎲 Ludo Arena — Next-Gen Multiplayer Ludo Web Game

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Ludo Arena** is a modern, responsive, and visually stunning web adaptation of the classic Ludo board game. Built with cutting-edge web technologies, it features physics-inspired 3D dice rolls, intelligent heuristic AI opponents, real-time multiplayer rooms, procedural audio synthesis, and an authentic 15x15 tournament board.

---

## ✨ Features

### 1. 🎮 Game Modes
- **🤖 Vs Computer (Solo)**: Play against 1 to 3 heuristic AI bots that evaluate threats, safe cells, and capture tactics.
- **👥 Pass & Play**: Local offline multiplayer on a single device for 2, 3, or 4 players.
- **🌐 Play with Friends (Custom Rooms)**: Create or join rooms with unique Room codes (e.g. `LUDO-7X92A`). Powered by zero-latency cross-tab synchronization with Socket.IO support.

### 2. 🎯 Authentic 15x15 Ludo Board
- Standard mathematical 15x15 grid layout with 4 home quadrants (Ruby Red, Emerald Green, Solar Yellow, Sapphire Blue).
- **52 common path perimeter cells** with 8 official safe star positions: `(6,1)`, `(2,6)`, `(1,8)`, `(6,12)`, `(8,13)`, `(12,8)`, `(13,6)`, and `(8,2)`.
- 4 home stretches leading directly into the center victory medallion.
- Stacking support for multiple tokens on the same cell with stack indicators.

### 3. 🎲 3D Animated Dice
- Dynamic 3D rotation animations with authentic pip arrangements (1 through 6).
- Keyboard shortcut support: press **Spacebar** to roll.
- Rolling consecutive three 6s penalty prevention.
- Integrated turn timer ring with auto-pass / auto-roll fail-safes.

### 4. 🔊 Procedural Web Audio Engine
- Built with the native Web Audio API — **zero external audio asset dependencies** and zero latency.
- Realistic procedural sound effects:
  - Rhythmic dice rattles
  - Token hop and step clicks
  - Safe star landing crystal chimes
  - Dramatic token capture impact & whoosh
  - Six-roll celebration chord
  - Grand victory fanfare & ambient procedural background soundtrack

### 5. 💬 In-Game Chat & Reactions
- Live in-game chat panel.
- Instant quick reactions: `😂`, `😡`, `🎉`, `👍`, `GG`, `🔥`, `👑`, `😱`.

### 6. 🏆 Profiles & Global Leaderboard
- Player profile with level progression, XP bars, and achievement badges.
- Match history tracking (Mode, Result, Tokens captured, Rank).
- Global hall of fame leaderboard with podium presentation (1st, 2nd, 3rd) and filter tabs.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism & Neon Glow Utilities
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio**: Web Audio API Procedural Synthesizer
- **Networking**: BroadcastChannel / LocalStorage Multi-Tab Sync + Socket.IO Client

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/isthakmohammad15-sketch/ludo.git
   cd ludo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📐 Project Structure

```
ludo/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Chat.jsx        # In-game live chat & quick reactions
│   │   ├── Dice.jsx        # 3D animated dice with pip layouts & timer
│   │   ├── GameControls.jsx# Audio, speed, restart, and rules controls
│   │   ├── GameHeader.jsx  # Arena status ticker & room code copy
│   │   ├── LudoBoard.jsx   # Master 15x15 board container & center victory
│   │   ├── LudoCell.jsx    # Individual cell with safe stars & token stacks
│   │   ├── Navbar.jsx      # Navigation bar & audio toggles
│   │   ├── PlayerPanel.jsx # Corner player cards & token statistics
│   │   ├── RulesModal.jsx  # Illustrated tournament rules modal
│   │   ├── Token.jsx       # 3D pawn token with bounce animations & glow
│   │   └── WinnerModal.jsx # Victory celebration with confetti cascade
│   ├── game/               # Core game engine logic (UI-independent)
│   │   ├── ai.js           # Heuristic AI bot decision engine
│   │   ├── coordinates.js  # 15x15 grid coordinates & safe cell mapping
│   │   ├── gameRules.js    # Rule validations, moves, captures, victory checks
│   │   ├── gameState.js    # State management & turn transitions
│   │   ├── movement.js     # Step-by-step movement & capture resolution
│   │   ├── multiplayer.js  # Cross-tab & Socket.io networking
│   │   ├── players.js      # Player themes, colors & avatars
│   │   └── sound.js        # Procedural Web Audio API sound synthesizer
│   ├── pages/              # Primary application views
│   │   ├── Game.jsx        # Battle arena page
│   │   ├── Home.jsx        # Landing page with mode selector
│   │   ├── Leaderboard.jsx # Podium & global rankings table
│   │   ├── Lobby.jsx       # Custom room lobby with player slots & chat
│   │   ├── Profile.jsx     # User statistics, XP bar & match history
│   │   └── Settings.jsx    # Audio, animation speed & theme preferences
│   ├── App.jsx             # Master application root
│   ├── index.css           # Design tokens, glassmorphism & 3D keyframes
│   └── main.jsx            # React root mount
├── index.html              # HTML5 entry with Google Fonts & SEO tags
├── package.json
└── vite.config.js          # Vite config with Tailwind CSS v4 plugin
```

---

## 📜 Tournament Rules Summary

1. **Entering the Track**: Tokens require rolling a **6** to leave the home base.
2. **Safe Zones**: Cells marked with **Stars (⭐)** and the entire colored **Home Stretch** are safe from capture.
3. **Capturing**: Landing on an opponent token on any regular track cell captures that token and sends it back to their base.
4. **Bonus Turns**: Awarded upon rolling a **6**, capturing an opponent, or bringing a token into the center **Home**.
5. **Consecutive Sixes**: Rolling three 6s in a row forfeits the third roll to prevent infinite turns.
6. **Victory**: The first player to guide all 4 tokens into the center home is crowned the Arena Champion.

---

## 📄 License

This project is licensed under the MIT License.
