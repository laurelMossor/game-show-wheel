'use client';

interface GradientCardProps {
	children: React.ReactNode;
	variant?: 'cream' | 'gold' | 'tan' | 'info';
	padding?: string;
	className?: string;
	style?: React.CSSProperties;
	maxWidth?: string;
}

export default function GradientCard({ 
	children, 
	variant = 'cream', 
	padding = '1.5rem',
	className = '',
	style = {},
	maxWidth
}: GradientCardProps) {
	const getGradientBackground = () => {
		switch (variant) {
			case 'gold':
				return 'linear-gradient(135deg, var(--gold-color) 0%, var(--warning-color) 100%)';
			case 'tan':
				return 'linear-gradient(135deg, var(--cream-color) 0%, var(--tan-color) 100%)';
			case 'info':
				return 'linear-gradient(135deg, var(--info-color) 0%, var(--sage-green) 100%)';
			case 'cream':
			default:
				return 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)';
		}
	};

	return (
		<div 
			className={className}
			style={{
				background: getGradientBackground(),
				border: '3px solid var(--deep-brown)',
				borderRadius: '15px',
				padding,
				boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
				maxWidth,
				...style
			}}
		>
			{children}
		</div>
	);
}
