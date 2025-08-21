'use client';

export default function GuestPage() {
	return (
		<div style={{
			minHeight: '100vh',
			backgroundColor: '#f0f0f0',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<div style={{
				backgroundColor: '#e8e8e8',
				padding: '2rem',
				borderRadius: '8px',
				textAlign: 'center'
			}}>
				<h1 style={{
					fontSize: '2rem',
					color: '#333',
					margin: 0
				}}>
					Guest
				</h1>
			</div>
		</div>
	);
}
