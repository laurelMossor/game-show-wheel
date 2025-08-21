'use client';

import { Player } from '@/types/game';
import GradientCard from './common/GradientCard';

interface GameStatusBannerProps {
	winner: Player | 'tie' | null;
	className?: string;
	style?: React.CSSProperties;
}

export default function GameStatusBanner({ winner, className = '', style = {} }: GameStatusBannerProps) {
	if (!winner) return null;

	const isTie = winner === 'tie';
	const winnerName = typeof winner === 'string' ? winner : winner.name;

	return (
		<GradientCard
			variant={isTie ? 'info' : 'gold'}
			padding="1.5rem"
			className={className}
			style={{
				marginBottom: '2rem',
				textAlign: 'center',
				...style
			}}
		>
			<div style={{
				color: isTie ? 'white' : 'var(--deep-brown)',
				fontFamily: "'Cinzel', serif",
				fontSize: '1.3rem',
				fontWeight: 'bold'
			}}>
				{isTie ? (
					<>🤝 Current Status: It&apos;s a Tie! 🤝</>
				) : (
					<>👑 Current Leader: {winnerName} 👑</>
				)}
			</div>
		</GradientCard>
	);
}
