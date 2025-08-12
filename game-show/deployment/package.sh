#!/bin/bash

# Game Show Packaging Script
# Creates a deployment package for Raspberry Pi

set -e

echo "📦 Game Show Packaging Script"
echo "============================="

# Configuration
PACKAGE_NAME="game-show-pi"
VERSION="1.0.0"
BUILD_DIR="build"
PACKAGE_DIR="$BUILD_DIR/$PACKAGE_NAME-$VERSION"

echo "📁 Creating package: $PACKAGE_NAME-$VERSION"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf "$BUILD_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy application files
echo "📋 Copying application files..."
cp -r server "$PACKAGE_DIR/"
cp -r static "$PACKAGE_DIR/"
cp -r templates "$PACKAGE_DIR/"
cp app.py "$PACKAGE_DIR/"
cp requirements.txt "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"

# Copy deployment files
echo "📦 Copying deployment files..."
cp -r deployment "$PACKAGE_DIR/"
chmod +x "$PACKAGE_DIR/deployment/install.sh"

# Create package structure
echo "📂 Creating package structure..."
mkdir -p "$PACKAGE_DIR/data"
mkdir -p "$PACKAGE_DIR/logs"

# Create package info
echo "ℹ️  Creating package info..."
cat > "$PACKAGE_DIR/PACKAGE_INFO.txt" << EOF
Game Show Application Package
============================

Package: $PACKAGE_NAME
Version: $VERSION
Platform: Raspberry Pi
Architecture: ARM

Contents:
- Flask web application
- Score tracking system
- Spinning wheel interface
- Auto-startup configuration
- Installation scripts

Installation:
1. Copy this package to your Raspberry Pi
2. Run: ./deployment/install.sh
3. Reboot your Pi

Requirements:
- Raspberry Pi (3B+ or 4 recommended)
- Raspberry Pi OS
- Internet connection for initial setup

Support:
- Check README.md for detailed instructions
- View logs in the logs/ directory
- Use provided scripts for service management
EOF

# Create quick start guide
echo "📖 Creating quick start guide..."
cat > "$PACKAGE_DIR/QUICK_START.md" << 'EOF'
# Quick Start Guide

## 1. Transfer Package
Copy this entire folder to your Raspberry Pi (e.g., via USB, SCP, or Samba)

## 2. Install Dependencies
```bash
cd game-show-pi-1.0.0
./deployment/install.sh
```

## 3. Reboot
```bash
sudo reboot
```

## 4. Access Game Show
The application will start automatically and open in your browser at:
- http://localhost:5000

## 5. Use the Application
- **F1**: Go to Score Board
- **F2**: Go to Spinning Wheel
- **Escape**: Close modals

## Troubleshooting
If the application doesn't start:
```bash
./deployment/status.sh
./deployment/logs.sh
./deployment/restart.sh
```

## Manual Start/Stop
```bash
./deployment/start.sh    # Start manually
./deployment/stop.sh     # Stop service
./deployment/restart.sh  # Restart service
```
EOF

# Create changelog
echo "📝 Creating changelog..."
cat > "$PACKAGE_DIR/CHANGELOG.md" << 'EOF'
# Changelog

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Score tracking for 3 players
- Interactive spinning wheel
- Auto-startup on Pi boot
- Browser-based interface
- Keyboard navigation shortcuts
- Responsive design
- Score persistence
- Real-time updates

### Features
- **Score Board**: Track points for three players
- **Spinning Wheel**: 8-segment wheel with point values
- **Auto-startup**: Runs automatically when Pi boots
- **Keyboard Shortcuts**: F1 for scores, F2 for wheel
- **Modern UI**: Professional game show appearance
- **Responsive**: Works on different screen sizes

### Technical
- Flask web server
- HTML5 Canvas wheel rendering
- CSS animations and styling
- JavaScript interactivity
- Systemd service integration
- Browser auto-launch configuration
EOF

# Create license file
echo "📄 Creating license file..."
cat > "$PACKAGE_DIR/LICENSE" << 'EOF'
MIT License

Copyright (c) 2024 Game Show Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create verification script
echo "🔍 Creating verification script..."
cat > "$PACKAGE_DIR/verify.sh" << 'EOF'
#!/bin/bash

echo "🔍 Game Show Package Verification"
echo "================================"

# Check required files
echo "📋 Checking required files..."
required_files=(
    "app.py"
    "requirements.txt"
    "server/__init__.py"
    "server/game_state.py"
    "server/wheel_logic.py"
    "static/css/main.css"
    "static/css/scores.css"
    "static/css/wheel.css"
    "static/js/main.js"
    "static/js/scores.js"
    "static/js/wheel.js"
    "templates/base.html"
    "templates/scores.html"
    "templates/wheel.html"
    "deployment/install.sh"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        missing_files+=("$file")
    fi
done

# Check Python syntax
echo ""
echo "🐍 Checking Python syntax..."
python_files=(
    "app.py"
    "server/__init__.py"
    "server/game_state.py"
    "server/wheel_logic.py"
)

python_errors=()
for file in "${python_files[@]}"; do
    if python3 -m py_compile "$file" 2>/dev/null; then
        echo "✅ $file (syntax OK)"
    else
        echo "❌ $file (syntax error)"
        python_errors+=("$file")
    fi
done

# Check file permissions
echo ""
echo "🔐 Checking file permissions..."
if [[ -x "deployment/install.sh" ]]; then
    echo "✅ deployment/install.sh (executable)"
else
    echo "❌ deployment/install.sh (not executable)"
fi

# Summary
echo ""
echo "📊 Verification Summary"
echo "======================"

if [[ ${#missing_files[@]} -eq 0 && ${#python_errors[@]} -eq 0 ]]; then
    echo "🎉 All checks passed! Package is ready for deployment."
    exit 0
else
    echo "⚠️  Some issues found:"
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo "   - ${#missing_files[@]} missing file(s)"
    fi
    
    if [[ ${#python_errors[@]} -gt 0 ]]; then
        echo "   - ${#python_errors[@]} Python syntax error(s)"
    fi
    
    exit 1
fi
EOF

chmod +x "$PACKAGE_DIR/verify.sh"

# Create archive
echo "📦 Creating package archive..."
cd "$BUILD_DIR"
tar -czf "$PACKAGE_NAME-$VERSION.tar.gz" "$PACKAGE_NAME-$VERSION/"

# Create checksum
echo "🔍 Creating checksum..."
sha256sum "$PACKAGE_NAME-$VERSION.tar.gz" > "$PACKAGE_NAME-$VERSION.sha256"

# Package info
echo ""
echo "📦 Package Created Successfully!"
echo "================================"
echo "Package: $PACKAGE_NAME-$VERSION.tar.gz"
echo "Size: $(du -h "$PACKAGE_NAME-$VERSION.tar.gz" | cut -f1)"
echo "Location: $BUILD_DIR/"
echo ""

# Verify package
echo "🔍 Verifying package..."
cd "$PACKAGE_NAME-$VERSION"
./verify.sh

echo ""
echo "✅ Package verification complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Transfer $PACKAGE_NAME-$VERSION.tar.gz to your Raspberry Pi"
echo "   2. Extract: tar -xzf $PACKAGE_NAME-$VERSION.tar.gz"
echo "   3. Install: cd $PACKAGE_NAME-$VERSION && ./deployment/install.sh"
echo "   4. Reboot your Pi"
echo ""
echo "🎮 Your Game Show package is ready!"
