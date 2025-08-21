# 🎭 Game Show Program

Interactive medieval-themed game show application with score tracking and spinning wheel. Two versions available: classic Flask/HTML and modern Next.js/React.

## 🚀 Quick Start

### V2 (Next.js - Recommended)
```bash
cd gameshow-app
npm install
npm run dev
# Open http://localhost:3000
```

### V1 (Flask)  
```bash
cd game-show
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
# Open http://localhost:5000
```

## ✨ Key Features

- **🏆 Score Tracking**: Three players with editable names and adjustable scores
- **🎯 Spinning Wheel**: Interactive medieval-styled wheel with various outcomes
- **💾 Persistence**: Game state automatically saved (localStorage in V2, memory in V1)
- **⌨️ Keyboard Controls**: F1 for scores, F2 for wheel, Space/Enter to spin
- **🎨 Medieval Theme**: Rich medieval fantasy styling with custom fonts

## 📁 Project Structure

```
game-show-wheel/
├── gameshow-app/           # V2 - Next.js (recommended)
│   ├── src/app/           # Pages: /, /scores, /wheel
│   ├── src/components/    # React components
│   └── package.json
├── game-show/             # V1 - Flask/HTML
│   ├── app.py
│   ├── server/
│   ├── static/
│   └── templates/
├── gameshow-V2/            # V2 - React refactor
│   ├── server/             # Flask API server
│   │   ├── app.py
│   │   ├── game_state.py
│   │   ├── wheel_logic.py
│   │   └── requirements.txt
│   └── frontend/           # Next.js React app
│       ├── src/
│       │   ├── app/        # Next.js pages
│       │   └── components/ # React components
│       ├── package.json
│       └── tsconfig.json
└── project-plan.md         # Detailed development plan
```

## 🎮 How to Use

- **Landing Page**: Overview and navigation
- **Score Board**: Manage player names and scores (+/-1, +/-10 buttons)
- **Spinning Wheel**: Click to spin or use Space/Enter
- **Navigation**: F1 for scores, F2 for wheel

## 🔧 Requirements

- **V2**: Node.js 18+
- **V1**: Python 3.7+
- Modern web browser with localStorage support
