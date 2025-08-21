# Game Show Program - Project Plan

## Project Overview
A game show program designed to run on desktop/laptop computers with two main interfaces:
1. **Score Tracking Interface** - Visual display for tracking scores of three players
2. **Spinning Wheel Interface** - Interactive wheel that players can spin to determine outcomes

## Technology Decision: HTML + Simple Web Server ✅

**Selected Approach:** HTML + Python Web Server (Flask)
**Rationale:** Best balance of development speed, visual quality, and local performance

**Pros:**
- Cross-platform compatibility
- Easy to style and customize
- Can run in any browser
- Lightweight server options
- Easy to add animations and visual effects
- Perfect for score tracking + spinning wheel mechanics

**Cons:**
- Requires browser (widely available)
- Slightly more complex setup than pure Python

## MVP Development Pathway

### Phase 1: Core Foundation (Week 1)
1. **Basic Flask Server Setup**
   - Create Flask application structure
   - Implement basic routing
   - Test server startup and response

2. **Score Tracking Backend**
   - Player score data models
   - Score update API endpoints
   - Basic game state management

3. **Simple Score Display Interface**
   - Basic HTML score board
   - CSS styling for game show aesthetics
   - JavaScript for score updates

### Phase 2: Spinning Wheel (Week 2)
1. **Wheel Interface Design**
   - HTML5 Canvas or CSS-based wheel
   - Wheel segment layout and styling
   - Spin button and controls

2. **Wheel Mechanics**
   - JavaScript spinning animation
   - Random result selection
   - Result display and scoring integration

3. **Integration**
   - Connect wheel results to score system
   - Add wheel-to-score navigation

### Phase 3: Local Deployment & Polish (Week 3)
1. **Local Setup & Configuration**
   - Cross-platform compatibility testing
   - Easy startup scripts
   - Performance optimization

2. **User Experience**
   - Navigation between screens
   - Keyboard shortcuts
   - Visual polish and animations

3. **Testing & Refinement**
   - Cross-browser testing
   - Performance optimization
   - Bug fixes and improvements

## Local Setup Instructions

### Prerequisites
- Modern computer (Windows, macOS, or Linux)
- Python 3.7+ installed
- Web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Project Setup
```bash
# Clone/download project
git clone <repository-url>
cd game-show-wheel

# Navigate to desired version
cd game-show        # For V1
# OR
cd gameshow-V2      # For V2
```

### Step 2: V1 Setup (Flask + HTML)
```bash
cd game-show

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt

# Run the application
python app.py
```

### Step 3: V2 Setup (React + Flask)
```bash
# Backend setup
cd gameshow-V2/server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup (in new terminal)
cd gameshow-V2/frontend
npm install

# Run both (in separate terminals)
# Terminal 1: python app.py (in server folder)
# Terminal 2: npm run dev (in frontend folder)
```

## Technical Architecture

### Backend (Flask)
```
game_show/
├── app.py              # Main Flask application
├── game_state.py       # Score tracking and game logic
├── wheel_logic.py      # Spinning wheel mechanics
├── config.py           # Configuration settings
└── requirements.txt    # Python dependencies
```

### Frontend Structure
```
static/
├── css/
│   ├── main.css        # Global styles
│   ├── scores.css      # Score board styling
│   └── wheel.css       # Wheel interface styling
├── js/
│   ├── main.js         # Main application logic
│   ├── scores.js       # Score management
│   └── wheel.js        # Wheel spinning mechanics
└── images/             # Game assets
```

### API Endpoints
- `GET /` - Main score display
- `GET /wheel` - Spinning wheel interface
- `POST /api/scores/update` - Update player scores
- `POST /api/wheel/spin` - Trigger wheel spin
- `GET /api/scores` - Get current scores

## Implementation Details

### Score Tracking System
- Three player scores stored in memory
- JSON API for score updates
- Real-time score display updates
- Score persistence (optional file storage)

### Spinning Wheel Mechanics
- CSS transforms for smooth animations
- JavaScript for spin physics and timing
- Random result selection
- Result display and score integration
- Configurable wheel segments

### Navigation System
- CLI commands for screen switching
- Keyboard shortcuts (F1 for scores, F2 for wheel)
- Auto-refresh and real-time updates

## Performance Targets

### Startup Time
- Flask server: < 3 seconds
- Browser launch: < 5 seconds
- Total startup: < 8 seconds

### Memory Usage
- Flask server: < 50MB
- Browser: < 100MB
- Total system: < 200MB

### Responsiveness
- Score updates: < 100ms
- Wheel spin animation: 60fps
- Screen switching: < 500ms

## Success Criteria

### Functional Requirements
- [ ] Three-player score tracking
- [ ] Interactive spinning wheel
- [ ] Smooth animations (60fps)
- [ ] CLI navigation between screens
- [ ] Auto-startup on Pi boot

### Performance Requirements
- [ ] Startup within 8 seconds
- [ ] Memory usage under 200MB
- [ ] Responsive score updates
- [ ] Smooth wheel animations

### User Experience
- [ ] Professional game show appearance
- [ ] Intuitive navigation
- [ ] Reliable operation
- [ ] Easy score management

## Next Steps
1. Set up development environment
2. Create Flask server structure
3. Implement basic score tracking
4. Design spinning wheel interface
5. Test on Raspberry Pi hardware
6. Deploy and configure auto-startup

## Development Timeline
- **Week 1**: Core server and score tracking
- **Week 2**: Spinning wheel implementation
- **Week 3**: Pi deployment and polish
- **Week 4**: Testing and optimization

---

# Game Show V2 - React/Next.js Refactor Plan

## Project Overview V2
Refactor the existing game show application to use modern React 19 with Next.js frontend and Python Flask backend. This version will provide better performance, maintainability, and developer experience while maintaining all existing functionality for local desktop/laptop use.

## Technology Stack V2

### Frontend
- **Next.js 15** with App Router
- **React 19** 
- **CSS Modules** (built into Next.js)

### Backend
- **Flask** (keeping it simple like V1)
- **In-memory storage** (no database needed)
- **Same endpoints as V1** for compatibility

## Architecture V2

### Project Structure
```
gameshow-V2/
├── frontend/                # Next.js React app
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── page.tsx    # Score tracking page
│   │   │   ├── wheel/
│   │   │   │   └── page.tsx # Wheel interface
│   │   │   └── layout.tsx  # Root layout
│   │   ├── components/     # React components
│   │   │   ├── ScoreBoard.tsx
│   │   │   ├── SpinningWheel.tsx
│   │   │   └── PlayerCard.tsx
│   │   └── styles/         # CSS modules
│   ├── package.json
│   └── next.config.js
└── server/                 # Simple Flask server
    ├── app.py              # Main Flask app (same as V1)
    ├── game_state.py       # Score tracking (same as V1)
    ├── wheel_logic.py      # Wheel mechanics (same as V1)
    └── requirements.txt
```

## API Design V2

### REST Endpoints (Same as V1)
- `GET /` - Score display page
- `GET /wheel` - Wheel interface page
- `POST /api/scores/update` - Update player scores
- `POST /api/wheel/spin` - Trigger wheel spin
- `GET /api/scores` - Get current scores

## Component Architecture

### React Components
1. **ScoreBoard.tsx**
   - Displays three player scores
   - Score increase/decrease controls
   - Uses fetch API to update backend

2. **SpinningWheel.tsx**
   - Basic wheel with CSS animations (add fancy animations later)
   - Spin button and result display
   - Integration with score system

3. **PlayerCard.tsx**
   - Individual player score display
   - Score adjustment controls

## Development Plan V2

### Phase 1: Backend Migration (Day 1) ✅ COMPLETED
1. **Copy Existing Backend** ✅
   - ✅ Copied V1 Flask server to V2 server folder
   - ✅ Files copied: app.py, game_state.py, wheel_logic.py, requirements.txt
   - ✅ Fixed import paths and changed port to 5001 (avoiding macOS AirPlay conflict)
   - ✅ Same endpoints maintained for compatibility

### Phase 2: Frontend Setup (Day 2-3) ✅ COMPLETED  
1. **Next.js Setup** ✅
   - ✅ Node.js v24.6.0 installed via Homebrew
   - ✅ Next.js 15 project initialized with TypeScript
   - ✅ React 19 RC configured for compatibility
   - ✅ TypeScript configuration completed

2. **Core Components** ✅
   - ✅ ScoreBoard component created
   - ✅ PlayerCard component created  
   - ✅ Basic pages created (/ for scores, /wheel for wheel)
   - ✅ CSS styling with inline styles (simplified approach)

### Phase 3: Wheel Component (Day 4-5) ✅ COMPLETED
1. **Basic Wheel** ✅
   - ✅ SpinningWheel React component created
   - ✅ Canvas-based wheel rendering 
   - ✅ Basic spin animation with easing
   - ✅ Result calculation and display
   - ✅ Ready to connect to backend API

### Phase 4: Integration (Next)
1. **Backend Connection**
   - Connect React frontend to Flask backend
   - Test API endpoints from React components
   - Ensure score updates work between frontend/backend

### Phase 5: Polish (Later - when we want animations)
1. **Enhanced Animations**
   - Add Framer Motion when needed
   - Improve wheel physics
   - Add visual effects

### Phase 6: Distribution (Optional)
1. **Packaging Options**
   - Electron app for desktop distribution
   - Docker containers for easy deployment
   - Executable builds for non-technical users

## Migration Strategy

### From V1 to V2
1. **Data Migration**
   - Export existing game configurations
   - Migrate wheel segment configurations
   - Preserve any saved game states

2. **Feature Parity**
   - Ensure all V1 features work in V2
   - Maintain same keyboard shortcuts
   - Keep familiar UI/UX patterns

3. **Deployment Options**
   - Side-by-side deployment for testing
   - Gradual rollout capability
   - Rollback plan if needed

## Performance Targets V2

### Startup Time
- Backend server: < 2 seconds
- Frontend build: < 5 seconds
- Total startup: < 7 seconds (improvement from V1)

### Memory Usage
- Backend: < 30MB (improvement from V1)
- Frontend bundle: < 2MB gzipped
- Runtime memory: < 150MB total

### User Experience
- Score updates: < 50ms (improvement from V1)
- Wheel animations: 60fps with hardware acceleration
- Page transitions: < 200ms

## Success Criteria V2

### Technical Improvements
- [ ] 50% faster score updates
- [ ] Reduced memory usage
- [ ] Better error handling and recovery
- [x] Type safety with TypeScript ✅
- [x] Better code organization and maintainability ✅



### Development Experience
- [x] Hot reload during development ✅
- [x] Better debugging tools ✅
- [ ] Automated testing setup
- [ ] CI/CD pipeline ready
- [ ] Docker deployment

## Current Status V2

### ✅ Completed
- Backend migration (Flask server copied and ready)
- Frontend foundation (Next.js + React 19 + TypeScript)
- Core components (ScoreBoard, PlayerCard, SpinningWheel)
- Basic wheel functionality with canvas rendering
- Development environment setup

### 🔄 Next Steps
- Update Next.js proxy configuration to point to port 5001
- Connect frontend to backend APIs
- Test full application flow
- Cross-platform testing and optimization
