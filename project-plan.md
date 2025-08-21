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
- **Guest Section**: Create a new guest area accessible without password
	- New route structure: `/guest` for public access
	- Placeholder content and components for guest functionality
	- Separate navigation and layout for guest vs admin areas

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

## Quick Setup

```bash
cd gameshow-app
npm install
npm run dev
# Open http://localhost:3000
```
