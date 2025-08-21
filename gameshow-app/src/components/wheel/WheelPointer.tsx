'use client';

interface WheelPointerProps {
	size?: string;
	color?: string;
	position?: 'right' | 'top' | 'left' | 'bottom';
	icon?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function WheelPointer({ 
	size = '2.5rem',
	color = '#228B22',
	position = 'right',
	icon = '🌱',
	className = '',
	style = {}
}: WheelPointerProps) {
	const getPositionStyles = () => {
		const baseStyles = {
			position: 'absolute' as const,
			zIndex: 10,
			fontSize: size,
			color,
			filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
		};

		switch (position) {
			case 'top':
				return {
					...baseStyles,
					top: '-15px',
					left: '50%',
					transform: 'translateX(-50%) rotate(-90deg)'
				};
			case 'bottom':
				return {
					...baseStyles,
					bottom: '-15px',
					left: '50%',
					transform: 'translateX(-50%) rotate(90deg)'
				};
			case 'left':
				return {
					...baseStyles,
					top: '50%',
					left: '-15px',
					transform: 'translateY(-50%) rotate(180deg)'
				};
			case 'right':
			default:
				return {
					...baseStyles,
					top: '50%',
					right: '-15px',
					transform: 'translateY(-50%)'
				};
		}
	};

	return (
		<div
			className={className}
			style={{
				...getPositionStyles(),
				...style
			}}
		>
			{icon}
		</div>
	);
}
