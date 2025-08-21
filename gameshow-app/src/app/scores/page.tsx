'use client';

import { useGameState } from '@/hooks/useGameState';
import PageHeader from '@/components/PageHeader';
import GameStatusBanner from '@/components/GameStatusBanner';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import UserDirectionsBanner from '@/components/UserDirectionsBanner';

export default function ScoresPage() {
	const { 
		players, 
		gameStarted, 
		updateScore, 
		updatePlayerName, 
		resetScores,
		resetGame,
		startGame,
		getWinner
	} = useGameState();

	const winner = getWinner();

	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '1200px', 
				margin: '0 auto',
				padding: '20px'
			}}>
				{/* Header */}
				<PageHeader
					title="🏆 GAME SHOW SCORES 🏆"
					statusBanner={<GameStatusBanner winner={winner} />}
				/>

				{/* Score Board */}
				<div style={{ 
					justifyContent: 'center',
					marginBottom: '2rem'
				}}>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
						gap: '2rem',
						marginBottom: '2rem'
					}}>
						<ScoreBoard 
							players={players}
							onUpdateScore={updateScore}
							onUpdatePlayerName={updatePlayerName}
						/>
					</div>
				</div>

				{/* Controls */}
				<GameControls
					gameStarted={gameStarted}
					onStartGame={startGame}
					onResetScores={resetScores}
					onResetGame={resetGame}
				/>

				{/* User Directions Banner */}
				<UserDirectionsBanner
					title="How to Use the Scoreboard"
					instructions={[
						{
							label: "Edit Names",
							description: "Click on any player name to edit, press to save or to cancel",
							shortcuts: ["Enter", "Escape"]
						},
						{
							label: "Update Favor", 
							description: "Click on favor value to type directly, or use the up/down arrows in the input field"
						},
						{
							label: "Navigation",
							description: "Use for Scores, for Wheel",
							shortcuts: ["F1", "F2"]
						}
					]}
					actions={[
						{
							text: "Refresh Scores",
							onClick: () => window.location.reload(),
							variant: "outline-secondary",
							icon: "🔄",
							subtext: "Click to sync with server (preserves local changes)"
						}
					]}
				/>
			</div>
		</div>
	);
}
