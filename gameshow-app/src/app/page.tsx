'use client';

import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import GameTitle from '@/components/GameTitle';
import NavigationCard from '@/components/common/NavigationCard';
import QuickScoresPreview from '@/components/scoreboard/QuickScoresPreview';
import QuickStartGuide from '@/components/QuickStartGuide';
import LoginForm from '@/components/LoginForm';

export default function Home() {
	const { players } = useGameState();
	const { isAuthenticated, isLoading, login, logout } = useAuth();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="game-container">
				<div style={{ 
					maxWidth: '400px', 
					margin: '0 auto',
					padding: '20px',
					textAlign: 'center'
				}}>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	// Show login form if not authenticated
	if (!isAuthenticated) {
		return <LoginForm onLogin={login} />;
	}

	// Show admin area if authenticated
	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '800px', 
				margin: '0 auto',
				padding: '20px',
				textAlign: 'center'
			}}>
				{/* Logout Button */}
				<div style={{ 
					textAlign: 'right', 
					marginBottom: '1rem' 
				}}>
					<button
						onClick={logout}
						style={{
							backgroundColor: '#8B4513',
							color: 'white',
							padding: '0.5rem 1rem',
							fontSize: '0.9rem',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer'
						}}
					>
						🚪 Logout
					</button>
				</div>

				{/* Main Title */}
				<GameTitle />

				{/* Navigation Cards */}
				<div style={{ 
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '2rem',
					marginBottom: '3rem'
				}}>
					<NavigationCard
						href="/scores"
						icon="📊"
						title="Score Board"
						description="Track player scores and manage the game"
					/>
					<NavigationCard
						href="/wheel"
						icon="🎯"
						title="Spinning Wheel"
						description="Spin the wheel of destiny"
					/>
				</div>

				{/* Quick Scores Preview */}
				<QuickScoresPreview players={players} />

				{/* Instructions */}
				<QuickStartGuide
					sections={[
						{
							title: "1. Score Board",
							description: "Set up player names and track scores throughout the game"
						},
						{
							title: "2. Spinning Wheel", 
							description: "Spin to determine game actions and outcomes"
						},
						{
							title: "Keyboard Shortcuts",
							description: "for Scores or for Wheel",
							shortcuts: ["F1", "F2"]
						}
					]}
				/>
			</div>
		</div>
	);
}
