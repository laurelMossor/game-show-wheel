'use client';

import { useGameState } from '@/hooks/useGameState';
import PageHeader from '@/components/common/PageHeader';
import ScoreBoard from '@/components/scoreboard/ScoreBoard';
import GameControls from '@/components/GameControls';
import UserDirectionsBanner from '@/components/UserDirectionsBanner';
import AdminProtected from '@/components/AdminProtected';

export default function ScoresPage() {
	const { 
		players, 
		updateScore, 
		updatePlayerName, 
		resetScores
	} = useGameState();

	return (
		<AdminProtected>
			<div className="game-container">
				<div style={{ 
					maxWidth: '1200px', 
					margin: '0 auto',
					padding: '20px'
				}}>
					{/* Header */}
					<PageHeader
						title="🏆 GAME SHOW SCORES 🏆"
					/>

					{/* Score Board */}
					<ScoreBoard 
						players={players}
						onUpdateScore={updateScore}
						onUpdatePlayerName={updatePlayerName}
					/>

					{/* Controls */}
					<GameControls />

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
								text: "Reset Scores",
								onClick: resetScores,
								variant: "warning",
								icon: "🔄",
								subtext: "Reset all player scores to 100"
							}
						]}
					/>
				</div>
			</div>
		</AdminProtected>
	);
}
