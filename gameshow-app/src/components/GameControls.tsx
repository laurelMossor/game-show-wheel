'use client';

import IconButton from './common/IconButton';

interface GameControlsProps {
	wheelHref?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function GameControls({ 
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
