'use client';

interface SpinResultBannerProps {
	result: string;
	isBlinking?: boolean;
	maxWidth?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function SpinResultBanner({ 
	result, 
	isBlinking = false,
	maxWidth = '800px',
	className = '',
	style = {}
}: SpinResultBannerProps) {
	return (
		<div 
			className={className}
			style={{ 
				display: 'flex',
				justifyContent: 'center',
				marginBottom: '1.5rem',
				...style
			}}
		>
			<div style={{
				padding: '20px',
				height: '80px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				maxWidth
			}}>
				<div 
					id="result-text"
					className={`result-text ${isBlinking ? 'blinking' : ''}`}
					style={{
						fontFamily: "'MedievalSharp', cursive",
						fontSize: '2.5rem',
						fontWeight: 'bold',
						color: isBlinking ? 'transparent' : 'var(--medieval-gold)',
						textShadow: isBlinking ? 'none' : '2px 2px 0px var(--medieval-brown-dark), 4px 4px 8px rgba(0, 0, 0, 0.5)',
						letterSpacing: '2px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '60px',
						padding: '10px 20px',
						lineHeight: '1',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						textTransform: 'uppercase'
					}}
				>
					{result || ''}
				</div>
			</div>
		</div>
	);
}
