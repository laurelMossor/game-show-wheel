'use client';

import IconButton from './common/IconButton';

interface GameControlsProps {
	gameStarted: boolean;
	onStartGame: () => void;
	onResetScores: () => void;
	onResetGame: () => void;
	wheelHref?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function GameControls({ 
	gameStarted, 
	onStartGame, 
	onResetScores, 
	onResetGame,
	wheelHref = '/wheel',
	className = '',
	style = {}
}: GameControlsProps) {
	return (
		<div 
			className={className}
			style={{ 
				display: 'flex',
				justifyContent: 'center',
				gap: '1rem',
				flexWrap: 'wrap',
				marginBottom: '2rem',
				...style
			}}
		>
			{!gameStarted && (
				<IconButton
					icon="🚀"
					variant="primary"
					onClick={onStartGame}
					style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
				>
					Start Game
				</IconButton>
			)}

			<IconButton
				icon="🔄"
				variant="warning"
				onClick={onResetScores}
			>
				Reset Scores
			</IconButton>

			<IconButton
				icon="🎮"
				variant="secondary"
				onClick={onResetGame}
			>
				New Game
			</IconButton>

			<IconButton
				icon="🎯"
				variant="primary"
				href={wheelHref}
			>
				Spin Wheel
			</IconButton>
		</div>
	);
}
