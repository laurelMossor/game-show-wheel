'use client';

import { useGameState } from '@/hooks/useGameState';
import GameTitle from '@/components/GameTitle';
import GameStatusBanner from '@/components/GameStatusBanner';
import NavigationCard from '@/components/common/NavigationCard';
import QuickScoresPreview from '@/components/scoreboard/QuickScoresPreview';
import QuickStartGuide from '@/components/QuickStartGuide';

export default function Home() {
	const { players, getWinner } = useGameState();
	const winner = getWinner();

	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '800px', 
				margin: '0 auto',
				padding: '20px',
				textAlign: 'center'
			}}>
				{/* Main Title */}
				<GameTitle />

				{/* Quick Status */}
				<GameStatusBanner winner={winner} />

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
