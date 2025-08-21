'use client';

import GradientCard from './common/GradientCard';
import KeyboardShortcut from './common/KeyboardShortcut';
import IconButton from './common/IconButton';

interface Instruction {
	label: string;
	description: string;
	shortcuts?: string[];
}

interface Action {
	text: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary' | 'warning' | 'outline-secondary';
	icon?: string;
	subtext?: string;
}

interface UserDirectionsBannerProps {
	title: string;
	instructions: Instruction[];
	actions?: Action[];
	className?: string;
	style?: React.CSSProperties;
}

export default function UserDirectionsBanner({ 
	title, 
	instructions, 
	actions = [],
	className = '',
	style = {}
}: UserDirectionsBannerProps) {
	return (
		<GradientCard
			variant="tan"
			className={className}
			style={{
				marginBottom: '2rem',
				position: 'relative',
				...style
			}}
		>
			{/* Decorative arrow */}
			<div style={{
				position: 'absolute',
				top: '-10px',
				left: '20px',
				width: '20px',
				height: '20px',
				background: 'var(--deep-brown)',
				transform: 'rotate(45deg)',
				zIndex: -1
			}} />

			<h3 style={{
				color: 'var(--deep-brown)',
				fontFamily: "'MedievalSharp', cursive",
				fontSize: '1.5rem',
				marginBottom: '1rem',
				textAlign: 'center',
				textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '0.5rem'
			}}>
				<span style={{ fontSize: '1.8rem' }}>ℹ️</span>
				{title}
			</h3>

			<div style={{
				fontFamily: "'Crimson Text', serif",
				color: 'var(--dark-color)',
				lineHeight: 1.6
			}}>
				{instructions.map((instruction, index) => (
					<p key={index} style={{ marginBottom: '0.5rem' }}>
						<strong>{instruction.label}:</strong> {instruction.description}
						{instruction.shortcuts && (
							<>
								{' '}
								<KeyboardShortcut keys={instruction.shortcuts} />
							</>
						)}
					</p>
				))}

				{actions.length > 0 && (
					<div style={{
						borderTop: '1px solid var(--deep-brown)',
						paddingTop: '1rem',
						marginTop: '1rem',
						textAlign: 'center'
					}}>
						{actions.map((action, index) => (
							<div key={index} style={{ marginBottom: index < actions.length - 1 ? '1rem' : '0' }}>
								<IconButton
									icon={action.icon || '🔄'}
									variant={action.variant || 'outline-secondary'}
									onClick={action.onClick}
									size="sm"
								>
									{action.text}
								</IconButton>
								{action.subtext && (
									<small style={{ 
										color: 'var(--secondary-color)', 
										marginLeft: '0.5rem',
										fontSize: '0.85rem',
										display: 'block',
										marginTop: '0.25rem'
									}}>
										{action.subtext}
									</small>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</GradientCard>
	);
}
