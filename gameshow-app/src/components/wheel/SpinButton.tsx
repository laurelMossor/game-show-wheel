'use client';

interface SpinButtonProps {
	isSpinning: boolean;
	onSpin: () => void;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export default function SpinButton({ 
	isSpinning, 
	onSpin, 
	disabled = false,
	className = '',
	style = {}
}: SpinButtonProps) {
	return (
		<div style={{ marginTop: '1.5rem' }}>
			<button
				onClick={onSpin}
				disabled={isSpinning || disabled}
				className={`btn btn-primary ${isSpinning ? '' : ''} ${className}`}
				style={{
					opacity: isSpinning || disabled ? 0.6 : 1,
					cursor: isSpinning || disabled ? 'not-allowed' : 'pointer',
					...style
				}}
			>
				<span style={{ marginRight: '0.5rem' }}>▶️</span>
				{isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
			</button>
		</div>
	);
}
