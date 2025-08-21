# 🎭 Game Show Program

Interactive medieval-themed game show application with score tracking and spinning wheel built with Next.js and React.

## 🚀 Quick Start

```bash
cd gameshow-app
npm install
npm run dev
# Open http://localhost:3000
```

## ✨ Key Features

- **🏆 Score Tracking**: Three players with editable names and adjustable scores
- **🎯 Spinning Wheel**: Interactive medieval-styled wheel with various outcomes
- **💾 Persistence**: Game state automatically saved with localStorage
- **⌨️ Keyboard Controls**: F1 for scores, F2 for wheel, Space/Enter to spin
- **🎨 Medieval Theme**: Rich medieval fantasy styling with custom fonts

## 📁 Project Structure

```
game-show-wheel/
├── gameshow-app/           # Next.js application
│   ├── src/app/           # Pages: /, /scores, /wheel
│   ├── src/components/    # React components
│   ├── src/hooks/         # Custom React hooks
│   ├── src/lib/           # Game logic and utilities
│   ├── src/types/         # TypeScript type definitions
│   └── package.json
└── project-plan.md         # Development documentation
```

## 🎮 How to Use

- **Landing Page**: Overview and navigation
- **Score Board**: Manage player names and scores (+/-1, +/-10 buttons)
- **Spinning Wheel**: Click to spin or use Space/Enter
- **Navigation**: F1 for scores, F2 for wheel

## 🔧 Requirements

- Node.js 18+
- Modern web browser with localStorage support
