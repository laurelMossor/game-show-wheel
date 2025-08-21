'use client';

interface KeyboardShortcutProps {
	keys: string | string[];
	className?: string;
	style?: React.CSSProperties;
}

export default function KeyboardShortcut({ keys, className = '', style = {} }: KeyboardShortcutProps) {
	const keyArray = Array.isArray(keys) ? keys : [keys];

	return (
		<>
			{keyArray.map((key, index) => (
				<span key={key}>
					<span 
						className={`shortcut ${className}`}
						style={{
							background: 'var(--warm-yellow)',
							padding: '0.2rem 0.5rem',
							borderRadius: '5px',
							fontWeight: 'bold',
							color: 'var(--deep-brown)',
							border: '1px solid var(--deep-brown)',
							fontFamily: 'monospace',
							...style
						}}
					>
						{key}
					</span>
					{index < keyArray.length - 1 && <span> or </span>}
				</span>
			))}
		</>
	);
}
