'use client';

import { Player } from '@/types/game';
import GradientCard from './GradientCard';

interface QuickScoresPreviewProps {
	players: Player[];
	title?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function QuickScoresPreview({ 
	players, 
	title = "Current Scores",
	className = '',
	style = {}
}: QuickScoresPreviewProps) {
	return (
		<GradientCard
			variant="tan"
			className={className}
			style={{
				marginBottom: '2rem',
				...style
			}}
		>
			<h3 style={{
				fontFamily: "'MedievalSharp', cursive",
				color: 'var(--deep-brown)',
				fontSize: '1.5rem',
				marginBottom: '1rem',
				textAlign: 'center'
			}}>
				{title}
			</h3>
			<div style={{ 
				display: 'flex',
				justifyContent: 'space-around',
				flexWrap: 'wrap',
				gap: '1rem'
			}}>
				{players.map((player) => (
					<div key={player.id} style={{
						fontFamily: "'Cinzel', serif",
						fontSize: '1.2rem',
						color: 'var(--dark-color)',
						textAlign: 'center'
					}}>
						<strong>{player.name}:</strong> {player.score}
					</div>
				))}
			</div>
		</GradientCard>
	);
}
