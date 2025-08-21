# 🎭 Medieval Game Show App

A modern, medieval-themed game show application built with Next.js and React. Features interactive score tracking and a spinning wheel of destiny with localStorage persistence.

## ✨ Features

- **🏆 Score Management**: Track scores for 3 players with editable names
- **🎯 Spinning Wheel**: Interactive wheel with medieval wooden styling
- **💾 Local Persistence**: Game state saved to localStorage
- **🎨 Medieval Theme**: Rich medieval fantasy styling with custom fonts
- **⌨️ Keyboard Controls**: F1 for scores, F2 for wheel, Space/Enter to spin
- **📱 Responsive Design**: Works on desktop and mobile
- **🎮 Pure Frontend**: No backend required - runs entirely in the browser

## 🏗️ Architecture

### **Modern React Stack**
- **Frontend**: Next.js 15 with TypeScript
- **State Management**: React hooks with localStorage persistence
- **Styling**: CSS-in-JS with medieval theme variables
- **Game Logic**: TypeScript classes and hooks

### **No Backend Required!**
This app runs entirely in the browser using:
- **localStorage** for game state persistence
- **React state** for real-time updates
- **Pure TypeScript** for game logic
- **Client-side rendering** for all features

## 📁 Project Structure

```
gameshow-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── scores/            # Score tracking page
│   │   ├── wheel/             # Spinning wheel page
│   │   └── globals.css        # Medieval theme styles
│   ├── components/            # Reusable components
│   │   ├── PlayerCard.tsx     # Player score card
│   │   ├── ScoreBoard.tsx     # Score display grid
│   │   └── SpinningWheel.tsx  # Wheel component
│   ├── hooks/                 # Custom React hooks
│   │   ├── useGameState.ts    # Game state management
│   │   └── useWheel.ts        # Wheel logic
│   ├── lib/                   # Core game logic
│   │   ├── gameState.ts       # Game state manager
│   │   └── wheelLogic.ts      # Wheel mechanics
│   └── types/                 # TypeScript definitions
│       └── game.ts            # Game type definitions
├── package.json
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
# Clone and setup
cd gameshow-app
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎮 How to Use

### **Landing Page** (`/`)
- Overview of current scores
- Navigation to Score Board or Spinning Wheel
- Quick start guide

### **Score Board** (`/scores`)
- Manage player names (click to edit)
- Track scores with +/-1 and +/-10 buttons
- Reset scores or start new game
- View current leader

### **Spinning Wheel** (`/wheel`)
- Click "SPIN THE WHEEL!" or press Space/Enter
- Watch the medieval wooden wheel spin
- Result displays with dramatic blinking effect
- Wheel segments: New Rule, Challenge, Audience Choice, etc.

### **Keyboard Shortcuts**
- `F1` - Go to Score Board
- `F2` - Go to Spinning Wheel  
- `Space` or `Enter` - Spin the wheel (on wheel page)

## 🎨 Medieval Theme

### **Visual Design**
- **Fonts**: MedievalSharp, Cinzel, Crimson Text
- **Colors**: Medieval browns, golds, greens
- **Styling**: Wooden wheel with grain texture, ornate borders
- **Effects**: Dramatic shadows, gradient backgrounds, blinking text

### **Wheel Design**
- **Water Wheel Style**: Wooden frame with slats
- **Soft Segment Colors**: Light, readable colors
- **Leaf Pointer**: Seedling emoji (🌱) with shadow effects
- **Wood Grain**: Procedural wood texture on wooden elements

## 🔧 Technical Features

### **State Management**
- `useGameState` hook for score tracking
- `useWheel` hook for wheel mechanics
- localStorage automatic persistence
- Cross-tab synchronization

### **Game Logic**
- `GameStateManager` class for score operations
- `WheelManager` class for spin calculations
- TypeScript interfaces for type safety
- Modular, testable architecture

### **Performance**
- Next.js optimizations
- Local state (no API calls)
- Efficient canvas rendering
- Smooth animations with requestAnimationFrame

## 🎯 Game Actions

The wheel can land on various actions:
- **New Rule**: Add a new game rule
- **Challenge**: Player challenge
- **Audience Choice**: Let audience decide
- **Duplicate**: Duplicate points
- **Reverse**: Reverse turn order
- **Swap**: Swap scores

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ localStorage support required

## 🛠️ Development

### **Adding New Features**
1. Define types in `src/types/game.ts`
2. Add logic to appropriate manager class
3. Create React hook if needed
4. Build UI components
5. Update routes as needed

### **Customizing the Wheel**
- Modify `DEFAULT_SEGMENTS` in `wheelLogic.ts`
- Update `SOFT_COLORS` for different segment colors
- Adjust `WheelConfig` for timing and behavior

### **Styling**
- Update CSS variables in `globals.css`
- Modify component styles inline
- Add new theme colors to the color palette

## 🚀 Deployment

This is a static Next.js app that can be deployed anywhere:

- **Vercel**: `npx vercel`
- **Netlify**: Drag and drop build folder
- **GitHub Pages**: Static export
- **Any static host**: Upload build output

## 📜 License

This project is for educational and entertainment purposes.

---

**Built with ❤️ using Next.js, React, and TypeScript**

*May your spins be ever in your favor! 🎯*
