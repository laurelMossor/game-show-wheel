'use client';

interface GameTitleProps {
	title?: string;
	subtitle?: string;
	titleStyle?: React.CSSProperties;
	subtitleStyle?: React.CSSProperties;
	className?: string;
}

export default function GameTitle({ 
	title = "🎭 MEDIEVAL GAME SHOW 🎭",
	subtitle = "Welcome to the ultimate game show experience! Track scores, spin the wheel of destiny, and crown your champion.",
	titleStyle = {},
	subtitleStyle = {},
	className = ""
}: GameTitleProps) {
	return (
		<div className={className} style={{ marginBottom: '3rem' }}>
			<h1 style={{
				fontFamily: "'MedievalSharp', cursive",
				fontSize: '4rem',
				color: 'var(--medieval-gold)',
				textShadow: '3px 3px 0px var(--medieval-brown-dark), 6px 6px 12px rgba(0, 0, 0, 0.5)',
				marginBottom: '1rem',
				letterSpacing: '3px',
				...titleStyle
			}}>
				{title}
			</h1>

			{subtitle && (
				<p style={{
					fontFamily: "'Crimson Text', serif",
					fontSize: '1.5rem',
					color: 'var(--light-color)',
					textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
					maxWidth: '600px',
					margin: '0 auto',
					...subtitleStyle
				}}>
					{subtitle}
				</p>
			)}
		</div>
	);
}
