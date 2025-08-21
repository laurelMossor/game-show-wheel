'use client';

import GradientCard from '../common/GradientCard';

interface WheelContainerProps {
	children: React.ReactNode;
	maxWidth?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function WheelContainer({ 
	children, 
	maxWidth = '800px',
	className = '',
	style = {}
}: WheelContainerProps) {
	return (
		<div 
			className={className}
			style={{ 
				display: 'flex',
				justifyContent: 'center',
				marginBottom: '2rem',
				...style
			}}
		>
			<GradientCard
				padding="1.5rem"
				style={{
					textAlign: 'center',
					maxWidth,
					width: '100%'
				}}
			>
				{children}
			</GradientCard>
		</div>
	);
}
