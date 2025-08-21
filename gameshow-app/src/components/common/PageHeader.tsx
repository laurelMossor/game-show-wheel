'use client';

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	statusBanner?: React.ReactNode;
	className?: string;
	titleStyle?: React.CSSProperties;
	subtitleStyle?: React.CSSProperties;
}

export default function PageHeader({ 
	title, 
	subtitle, 
	statusBanner, 
	className = '',
	titleStyle = {},
	subtitleStyle = {}
}: PageHeaderProps) {
	return (
		<div 
			className={className}
			style={{ 
				textAlign: 'center',
				marginBottom: '2rem'
			}}
		>
			<h1 style={{
				fontFamily: "'MedievalSharp', cursive",
				fontSize: '3rem',
				color: 'var(--medieval-gold)',
				textShadow: '2px 2px 0px var(--medieval-brown-dark), 4px 4px 8px rgba(0, 0, 0, 0.5)',
				marginBottom: '1rem',
				...titleStyle
			}}>
				{title}
			</h1>

			{subtitle && (
				<p style={{
					fontFamily: "'Crimson Text', serif",
					fontSize: '1.3rem',
					color: 'var(--light-color)',
					textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
					marginBottom: '1rem',
					...subtitleStyle
				}}>
					{subtitle}
				</p>
			)}

			{statusBanner}
		</div>
	);
}
