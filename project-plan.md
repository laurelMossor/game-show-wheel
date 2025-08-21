# Game Show Program - Project Plan

## Project Overview
Medieval-themed game show application with score tracking and spinning wheel for desktop/laptop computers. Built with modern Next.js/React architecture and TypeScript.

## Technology Stack ✅

**Next.js 15 + React 19 + TypeScript** - Modern architecture with excellent developer experience and maintainability.

## Current Status

### Application 
- Modern React architecture with TypeScript and Next.js 15
- Complete component library (ScoreBoard, PlayerCard, SpinningWheel)
- localStorage persistence for game state
- Medieval fantasy theme with smooth animations
- Score tracking for 3 players with editable names
- Interactive spinning wheel with various outcomes
- Keyboard shortcuts (F1/F2, Space/Enter)
- Comprehensive test coverage
- Pure frontend (no backend required)

## Next Steps - Authentication & Access Control

### Password Protection Implementation
- **Admin Area**: Move the wheel and score functionality behind a simple password protection system
	- Password: `admin-pass` (session-based, remains active for the session)
	- Protect `/wheel` and `/scores` routes with authentication middleware
	- Create login form component for password entry
	- Use session storage to maintain authentication state

### Guest Area Development  
- **Guest Section**: Internet-accessible suggestion submission system
	- **Primary Function**: Provide public link for audience to submit suggestions
	- **Route Structure**: `/guest` for public display, `/suggestions` for form submission
	- **Purpose**: Allow audience members to access via simple internet link and submit suggestions
	- **Key Requirement**: App must be accessible from internet (IP address or domain)

### App Structure Reorganization
- **Admin Landing Page**: Current home page (`/`) becomes the password-protected admin area landing
	- Password protection required to access this page
	- Contains existing navigation to wheel and scores functionality
	- Serves as the main hub for admin users after authentication
- **Guest Landing Page**: New placeholder page (`/guest`) for public access
	- Publicly accessible without password
	- Placeholder content and navigation for guest functionality
	- Separate entry point for non-admin users

### Technical Implementation
- Session-based authentication using browser sessionStorage
- Route protection middleware for admin pages
- Conditional navigation based on authentication status
- Graceful handling of authentication state across page refreshes

**Note**: Keep implementation simple and straightforward - avoid over-engineering or adding unnecessary complexity. Focus on core functionality with minimal additional features.

## Internet-Accessible Suggestion System

### Implementation Possibilities

#### **Option 1: Local Network Access**
- **Network Setup**: Run dev server with `npm run dev -- --host 0.0.0.0`
- **Find Local IP**: Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to get local IP
- **Access Method**: Share local IP address (e.g., `http://192.168.1.100:3000/suggestions`) with audience
- **Router Requirements**: Devices must be on same WiFi network
- **Data Storage**: Use localStorage for simple implementation
- **Pros**: Simple setup, no external dependencies, works for local events
- **Cons**: Limited to same WiFi network, IP may change, not true internet access

#### **Option 2: Internet Hosting (Recommended)**
- **Hosting Options**: Deploy to Vercel, Netlify, or simple VPS
- **Public Access - Detailed Options**:
  - **Free Hosting with Auto-Generated URLs**:
    - Vercel: `https://gameshow-app-username.vercel.app`
    - Netlify: `https://amazing-name-123456.netlify.app`
    - GitHub Pages: `https://username.github.io/gameshow-app`
  - **Custom Domain Options** (Optional):
    - Buy domain ($10-15/year): `gameshow.com`, `myevent.org`
    - Connect to hosting service via DNS settings
    - Result: `https://gameshow.com/suggestions`
  - **IP Address Access**:
    - VPS hosting: Get dedicated IP like `http://123.456.789.012:3000`
    - Cloud services provide both IP and domain access
- **Backend Need**: Requires API routes for cross-device data sharing
- **Database**: Simple JSON file storage or lightweight database
- **Pros**: True internet access, persistent data, professional setup, permanent URLs
- **Cons**: Requires deployment setup, potential hosting costs ($0-20/month)

#### **Option 3: Tunnel Service (Easiest Remote Access)**
- **Tunneling**: Use ngrok, localtunnel, or similar to expose local server
- **Setup Steps**:
  1. Install ngrok: `npm install -g ngrok` or download from ngrok.com
  2. Run your app: `npm run dev`
  3. In new terminal: `ngrok http 3000`
  4. Copy the public URL (e.g., `https://abc123.ngrok.io`)
- **Public URL**: Share the ngrok URL + `/suggestions` with audience
- **Data Storage**: Can use localStorage or upgrade to backend
- **Pros**: True internet access, works from anywhere, simple setup
- **Cons**: Temporary URLs (change each restart), free tier has limits

#### **Option 4: Hybrid Approach**
- **Development**: Start with tunnel service for immediate testing
- **Production**: Deploy to hosting service for permanent solution
- **Backend**: Add Next.js API routes for suggestion handling
- **Admin Dashboard**: Real-time view of incoming suggestions
- **Pros**: Best of both worlds, scalable approach
- **Cons**: More complex, multiple steps to implement

### Recommended Approach
**Option 3 (Tunnel Service)** for immediate remote access, then optionally upgrade to Option 2 for production use. Tunneling services like ngrok provide the easiest path to make your local server accessible from the internet.

### Detailed Implementation: Making Local Server Remotely Accessible

#### **The Reality of "Local Server + Remote Access"**
Yes, it's absolutely possible, but there are important practical considerations:

#### **Method 1: Router Port Forwarding (Advanced)**
- **How it works**: Configure your router to forward external traffic to your local machine
- **Steps**:
  1. Find your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
  2. Access router admin panel (usually `192.168.1.1` or `192.168.0.1`)
  3. Set up port forwarding: External port 80/443 → Your local IP:3000
  4. Find your public IP: Visit whatismyipaddress.com
  5. Share `http://YOUR_PUBLIC_IP/suggestions` with audience
- **Challenges**: 
  - Router configuration varies by model/ISP
  - Many ISPs block incoming connections or use CGNAT
  - Security risks of exposing local network
  - Dynamic IP addresses change periodically
  - Requires technical networking knowledge

#### **Method 2: Tunnel Services (Recommended)**
- **How it works**: Third-party service creates secure tunnel from internet to your local server
- **ngrok Example**:
  ```bash
  # Terminal 1: Start your app
  npm run dev
  
  # Terminal 2: Create tunnel
  ngrok http 3000
  
  # Result: Public URL like https://abc123.ngrok.io
  # Share: https://abc123.ngrok.io/suggestions
  ```
- **Advantages**: 
  - Works regardless of router/ISP restrictions
  - HTTPS included automatically
  - No networking configuration needed
  - Works from anywhere with internet
- **Limitations**:
  - Free tier: 1 concurrent tunnel, URLs change on restart
  - Paid plans: $8-10/month for persistent URLs
  - Dependent on third-party service

#### **Method 3: Quick Cloud Deployment**
- **Vercel (Free)**:
  ```bash
  npm install -g vercel
  vercel --prod
  # Gets permanent URL like https://gameshow-app.vercel.app
  ```
- **Advantages**: Permanent URL, fast deployment, free tier
- **Requirements**: Need to add API routes for cross-device data storage

### Step-by-Step: Getting Public URL/Domain Access

#### **Easiest: Free Hosting Services**

**Vercel Deployment (Recommended)**:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel (creates free account)
vercel login

# 3. Deploy from your project directory
cd gameshow-app
vercel --prod

# 4. Result: Get permanent URL like https://gameshow-app-abc123.vercel.app
# 5. Share with audience: https://gameshow-app-abc123.vercel.app/suggestions
```

**Netlify Deployment**:
```bash
# 1. Build your app
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=out

# 4. Result: Get URL like https://wonderful-app-123456.netlify.app
```

#### **Custom Domain Setup (Optional)**
If you want a custom domain like `gameshow.com` instead of auto-generated URLs:

1. **Buy Domain** ($10-15/year):
   - Namecheap, GoDaddy, Google Domains, etc.
   - Example: `myevent.com`, `gameshow.live`

2. **Connect to Hosting Service**:
   - Vercel: Add domain in dashboard, update DNS records
   - Netlify: Domain settings → Add custom domain
   - Update domain's DNS to point to hosting service

3. **Result**: 
   - Instead of: `https://gameshow-app-abc123.vercel.app/suggestions`
   - You get: `https://myevent.com/suggestions`

#### **VPS/Server Options** (More Control)
For dedicated IP address access:

- **DigitalOcean Droplet**: $5/month, get IP like `123.456.789.012`
- **AWS EC2**: Free tier available, more complex setup
- **Linode**: $5/month, simple Linux server
- **Access**: Share `http://123.456.789.012:3000/suggestions` with audience

#### **What Your Audience Sees**
Regardless of method, your audience gets a simple link:
- Free hosting: `https://gameshow-app-abc123.vercel.app/suggestions`
- Custom domain: `https://myevent.com/suggestions`  
- VPS/IP: `http://123.456.789.012:3000/suggestions`

They visit the link on their phones/devices and submit suggestions directly.

### Key Implementation Requirements
- **Public URL**: Audience needs simple link to access suggestion form
- **Suggestion Form**: Mobile-friendly form at `/suggestions` route
- **Data Persistence**: Suggestions must be stored and viewable by admin
- **Admin Integration**: Add "View Suggestions" section to admin area
- **Cross-Device**: Multiple people should be able to submit simultaneously

## Quick Setup

```bash
cd gameshow-app
npm install
npm run dev
# Open http://localhost:3000
```
