'use client';

import Link from 'next/link';

interface NavigationCardProps {
	href: string;
	icon: string;
	title: string;
	description: string;
	className?: string;
	height?: string;
}

export default function NavigationCard({ 
	href, 
	icon, 
	title, 
	description, 
	className = '',
	height = '200px'
}: NavigationCardProps) {
	return (
		<Link 
			href={href}
			style={{ textDecoration: 'none' }}
			className={className}
		>
			<div style={{
				background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
				padding: '2rem',
				borderRadius: '20px',
				border: '3px solid var(--deep-brown)',
				boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
				transition: 'all 0.3s ease',
				cursor: 'pointer',
				height,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}
			onMouseOver={(e) => {
				e.currentTarget.style.transform = 'translateY(-5px)';
				e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
			}}
			onMouseOut={(e) => {
				e.currentTarget.style.transform = 'translateY(0)';
				e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
			}}
		>
			<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
			<h2 style={{
				fontFamily: "'Cinzel', serif",
				fontSize: '1.8rem',
				color: 'var(--deep-brown)',
				marginBottom: '0.5rem'
			}}>
				{title}
			</h2>
			<p style={{
				fontFamily: "'Crimson Text', serif",
				color: 'var(--dark-color)',
				fontSize: '1.1rem',
				textAlign: 'center'
			}}>
				{description}
			</p>
		</div>
	</Link>
	);
}
