#!/bin/bash

# Game Show Installation Script for Raspberry Pi
# This script sets up the game show application on a Raspberry Pi

set -e  # Exit on any error

echo "🎮 Game Show Installation Script for Raspberry Pi"
echo "================================================"

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
    echo "⚠️  Warning: This script is designed for Raspberry Pi"
    echo "   It may work on other systems but is not guaranteed"
    echo ""
fi

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    echo "❌ Please do not run this script as root"
    echo "   Run as a regular user (pi) instead"
    exit 1
fi

# Configuration
GAME_SHOW_DIR="$HOME/game-show"
SERVICE_NAME="game-show"
BROWSER="chromium-browser"

echo "📁 Installing to: $GAME_SHOW_DIR"
echo "🌐 Browser: $BROWSER"
echo ""

# Update system packages
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y python3-pip python3-venv $BROWSER

# Create game show directory
echo "📁 Creating game show directory..."
mkdir -p "$GAME_SHOW_DIR"
cd "$GAME_SHOW_DIR"

# Create virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📚 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
echo "📂 Creating application directories..."
mkdir -p logs
mkdir -p data

# Set up auto-startup configuration
echo "🚀 Setting up auto-startup..."

# Create desktop entry for browser auto-launch
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/game-show.desktop << EOF
[Desktop Entry]
Type=Application
Name=Game Show
Exec=$BROWSER --kiosk --disable-web-security --user-data-dir=/tmp/game-show http://localhost:5000
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

chmod +x ~/.config/autostart/game-show.desktop

# Create systemd service
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Game Show Flask Server
After=network.target
Wants=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$GAME_SHOW_DIR
Environment=PATH=$GAME_SHOW_DIR/venv/bin
ExecStart=$GAME_SHOW_DIR/venv/bin/python app.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🔧 Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME.service
sudo systemctl start $SERVICE_NAME.service

# Wait for service to start
echo "⏳ Waiting for service to start..."
sleep 5

# Check service status
if sudo systemctl is-active --quiet $SERVICE_NAME.service; then
    echo "✅ Service started successfully!"
else
    echo "❌ Service failed to start. Checking logs..."
    sudo journalctl -u $SERVICE_NAME.service --no-pager -n 20
    exit 1
fi

# Create startup script
echo "📝 Creating startup script..."
cat > "$GAME_SHOW_DIR/start.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
python app.py
EOF

chmod +x "$GAME_SHOW_DIR/start.sh"

# Create stop script
echo "📝 Creating stop script..."
cat > "$GAME_SHOW_DIR/stop.sh" << 'EOF'
#!/bin/bash
sudo systemctl stop game-show.service
EOF

chmod +x "$GAME_SHOW_DIR/stop.sh"

# Create restart script
echo "📝 Creating restart script..."
cat > "$GAME_SHOW_DIR/restart.sh" << 'EOF'
#!/bin/bash
sudo systemctl restart game-show.service
EOF

chmod +x "$GAME_SHOW_DIR/restart.sh"

# Create status script
echo "📝 Creating status script..."
cat > "$GAME_SHOW_DIR/status.sh" << 'EOF'
#!/bin/bash
sudo systemctl status game-show.service
EOF

chmod +x "$GAME_SHOW_DIR/status.sh"

# Create logs script
echo "📝 Creating logs script..."
cat > "$GAME_SHOW_DIR/logs.sh" << 'EOF'
#!/bin/bash
sudo journalctl -u game-show.service -f
EOF

chmod +x "$GAME_SHOW_DIR/logs.sh"

# Set permissions
echo "🔐 Setting permissions..."
chmod 755 "$GAME_SHOW_DIR"
chmod 644 "$GAME_SHOW_DIR"/*.py
chmod 644 "$GAME_SHOW_DIR"/*.txt
chmod 644 "$GAME_SHOW_DIR"/*.md

# Create configuration file
echo "⚙️  Creating configuration file..."
cat > "$GAME_SHOW_DIR/config.py" << 'EOF'
# Game Show Configuration
import os

# Server Configuration
HOST = '0.0.0.0'
PORT = 5000
DEBUG = False

# Game Configuration
MAX_PLAYERS = 3
DEFAULT_SCORES = {'Player 1': 0, 'Player 2': 0, 'Player 3': 0}

# Wheel Configuration
WHEEL_SEGMENTS = [
    {"id": 0, "text": "100", "points": 100, "color": "#FF6B6B"},
    {"id": 1, "text": "200", "points": 200, "color": "#4ECDC4"},
    {"id": 2, "text": "300", "points": 300, "color": "#45B7D1"},
    {"id": 3, "text": "400", "points": 400, "color": "#96CEB4"},
    {"id": 4, "text": "500", "points": 500, "color": "#FFEAA7"},
    {"id": 5, "text": "600", "points": 600, "color": "#DDA0DD"},
    {"id": 6, "text": "700", "points": 700, "color": "#98D8C8"},
    {"id": 7, "text": "800", "points": 800, "color": "#F7DC6F"}
]

# File Paths
SCORES_FILE = os.path.join(os.path.dirname(__file__), 'data', 'game_scores.json')
LOGS_DIR = os.path.join(os.path.dirname(__file__), 'logs')

# Ensure directories exist
os.makedirs(os.path.dirname(SCORES_FILE), exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
EOF

# Create README for Pi
echo "📖 Creating README file..."
cat > "$GAME_SHOW_DIR/README_PI.md" << 'EOF'
# Game Show - Raspberry Pi Edition

## Quick Start
The game show application should start automatically when you boot your Pi.

## Manual Control
- **Start**: `./start.sh`
- **Stop**: `./stop.sh`
- **Restart**: `./restart.sh`
- **Status**: `./status.sh`
- **View Logs**: `./logs.sh`

## Access the Application
- **Local**: http://localhost:5000
- **Network**: http://[PI_IP_ADDRESS]:5000

## Keyboard Shortcuts
- **F1**: Go to Scores
- **F2**: Go to Wheel
- **Escape**: Close modals

## Troubleshooting
If the application doesn't start:
1. Check service status: `./status.sh`
2. View logs: `./logs.sh`
3. Restart service: `./restart.sh`

## Files
- `app.py`: Main application
- `config.py`: Configuration settings
- `data/`: Score data storage
- `logs/`: Application logs
- `static/`: Web assets
- `templates/`: HTML templates

## Support
Check the logs for error messages and ensure all dependencies are installed.
EOF

echo ""
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "📱 The game show will start automatically on boot"
echo "🌐 Access it at: http://localhost:5000"
echo "🔧 Use the scripts in $GAME_SHOW_DIR to control the service"
echo ""
echo "📋 Next steps:"
echo "   1. Reboot your Pi: sudo reboot"
echo "   2. The game show should start automatically"
echo "   3. Access it in your browser at http://localhost:5000"
echo ""
echo "📚 For more information, see: $GAME_SHOW_DIR/README_PI.md"
echo ""
echo "🎮 Enjoy your Game Show!"
