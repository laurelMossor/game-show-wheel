# Game Show Program - Project Plan

## Project Overview
A game show program designed to run on a Raspberry Pi with two main interfaces:
1. **Score Tracking Interface** - Visual display for tracking scores of three players
2. **Spinning Wheel Interface** - Interactive wheel that players can spin to determine outcomes

## Technology Decision: HTML + Simple Web Server ✅

**Selected Approach:** HTML + Python Web Server (Flask)
**Rationale:** Best balance of development speed, visual quality, and Pi performance

**Pros:**
- Cross-platform compatibility
- Easy to style and customize
- Can run in any browser
- Lightweight server options
- Easy to add animations and visual effects
- Perfect for score tracking + spinning wheel mechanics

**Cons:**
- Requires browser installation on Pi
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

### Phase 3: Pi Deployment & Polish (Week 3)
1. **Pi Setup & Configuration**
   - Browser installation and configuration
   - Auto-startup configuration
   - Performance optimization

2. **User Experience**
   - CLI navigation between screens
   - Keyboard shortcuts
   - Visual polish and animations

3. **Testing & Refinement**
   - Pi hardware testing
   - Performance optimization
   - Bug fixes and improvements

## Raspberry Pi Setup Instructions

### Prerequisites
- Raspberry Pi (3B+ or 4 recommended)
- MicroSD card with Raspberry Pi OS
- Display and input devices
- Power supply

### Step 1: Initial Pi Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python dependencies
sudo apt install python3-pip python3-venv -y

# Install browser (Chromium recommended for Pi)
sudo apt install chromium-browser -y
```

### Step 2: Project Setup
```bash
# Clone/create project directory
mkdir ~/game-show
cd ~/game-show

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python requirements
pip install flask
```

### Step 3: Browser Auto-Launch Configuration
```bash
# Create desktop entry for auto-startup
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/game-show.desktop << EOF
[Desktop Entry]
Type=Application
Name=Game Show
Exec=chromium-browser --kiosk --disable-web-security --user-data-dir=/tmp/game-show http://localhost:5000
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

# Make executable
chmod +x ~/.config/autostart/game-show.desktop
```

### Step 4: System Service Setup
```bash
# Create systemd service for auto-startup
sudo tee /etc/systemd/system/game-show.service << EOF
[Unit]
Description=Game Show Flask Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/game-show
Environment=PATH=/home/pi/game-show/venv/bin
ExecStart=/home/pi/game-show/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable game-show.service
sudo systemctl start game-show.service
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
