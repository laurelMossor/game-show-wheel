# Game Show Program

Interactive game show program with score tracking and spinning wheel, designed for desktop and laptop computers.

## Tech Stack

### V1 (Original)
- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript  
- **Deployment**: Local desktop/laptop deployment
- **UI**: Responsive design with medieval fantasy theme

### V2 (React Refactor)
- **Backend**: Python Flask (same as V1)
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Development**: Hot reload, TypeScript safety
- **UI**: Modern React components with inline styling

## Quick Start

### V1 (Original Version)

1. **Clone the repository**
2. **Set up Python virtual environment**:
   ```bash
   cd game-show
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Run the application**:
   ```bash
   python app.py
   ```
4. **Open browser**: Navigate to `http://localhost:5000`

### V2 (React Version)

#### Prerequisites
- **Node.js** (v24.6.0 or later)
- **Python 3** for backend

#### Frontend Setup
```bash
cd gameshow-V2/frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`

#### Backend Setup  
```bash
cd gameshow-V2/server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Backend API will run at `http://localhost:5001`

#### Full Development Setup
Run both frontend and backend simultaneously:

**Terminal 1 (Backend):**
```bash
cd gameshow-V2/server
source venv/bin/activate
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd gameshow-V2/frontend  
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Usage

### V1 Features
- **Score Tracking**: Main page shows three player scores with +/- controls
- **Spinning Wheel**: Navigate to `/wheel` for the interactive spinning wheel
- **Keyboard Shortcuts**: 
  - F1: Return to scores
  - F2: Go to wheel
  - Space/Enter: Spin wheel (when on wheel page)

### V2 Features  
- **Score Tracking**: React-based score board with real-time updates
- **Spinning Wheel**: Canvas-based wheel with smooth animations
- **TypeScript**: Full type safety and better developer experience
- **Hot Reload**: Instant updates during development
- **Component Architecture**: Modular, reusable React components

## Development Status

### V1 ✅ Complete
- Fully functional game show application
- Ready for local desktop/laptop deployment
- Medieval fantasy theme with animations

### V2 🔄 In Progress  
- ✅ Backend migration complete
- ✅ React frontend foundation complete
- ✅ Core components (ScoreBoard, PlayerCard, SpinningWheel)
- ✅ TypeScript configuration
- 🔄 **Next**: Connect frontend to backend APIs

## Project Structure

```
game-show-wheel/
├── game-show/              # V1 - Original Flask app
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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
