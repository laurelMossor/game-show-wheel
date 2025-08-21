'use client';

import Link from 'next/link';

interface IconButtonProps {
	icon: string;
	children: React.ReactNode;
	variant?: 'primary' | 'secondary' | 'warning' | 'outline-secondary';
	onClick?: () => void;
	href?: string;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
	size?: 'sm' | 'md' | 'lg';
}

export default function IconButton({ 
	icon, 
	children, 
	variant = 'primary',
	onClick,
	href,
	disabled = false,
	className = '',
	style = {},
	size = 'md'
}: IconButtonProps) {
	const getButtonClasses = () => {
		let classes = `btn btn-${variant}`;
		if (size === 'sm') classes += ' btn-sm';
		if (size === 'lg') classes += ' btn-lg';
		return `${classes} ${className}`;
	};

	const getButtonStyle = () => {
		const baseStyle: React.CSSProperties = {
			display: 'inline-flex',
			alignItems: 'center',
			textDecoration: 'none',
			...style
		};

		// Special styling for warning variant
		if (variant === 'warning') {
			baseStyle.background = 'linear-gradient(45deg, var(--warning-color), var(--gold-color))';
			baseStyle.color = 'var(--deep-brown)';
		}

		// Special styling for outline-secondary variant
		if (variant === 'outline-secondary') {
			baseStyle.borderColor = 'var(--deep-brown)';
			baseStyle.color = 'var(--deep-brown)';
			baseStyle.background = 'transparent';
			baseStyle.transition = 'all 0.3s ease';
		}

		return baseStyle;
	};

	const content = (
		<>
			<span style={{ marginRight: '0.5rem' }}>{icon}</span>
			{children}
		</>
	);

	const buttonProps = {
		className: getButtonClasses(),
		style: getButtonStyle(),
		disabled,
		...(onClick && { onClick }),
		...(variant === 'outline-secondary' && {
			onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
				e.currentTarget.style.background = 'rgba(101, 67, 33, 0.1)';
				e.currentTarget.style.borderColor = 'var(--medieval-gold)';
				e.currentTarget.style.color = 'var(--medieval-gold)';
			},
			onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
				e.currentTarget.style.background = 'transparent';
				e.currentTarget.style.borderColor = 'var(--deep-brown)';
				e.currentTarget.style.color = 'var(--deep-brown)';
			}
		})
	};

	if (href) {
		return (
			<Link href={href} {...buttonProps}>
				{content}
			</Link>
		);
	}

	return (
		<button {...buttonProps}>
			{content}
		</button>
	);
}
