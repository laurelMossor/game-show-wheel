'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';

export default function Home() {
	const { players, getWinner } = useGameState();
	const winner = getWinner();

	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '800px', 
				margin: '0 auto',
				padding: '20px',
				textAlign: 'center'
			}}>
				{/* Main Title */}
				<div style={{ marginBottom: '3rem' }}>
					<h1 style={{
						fontFamily: "'MedievalSharp', cursive",
						fontSize: '4rem',
						color: 'var(--medieval-gold)',
						textShadow: '3px 3px 0px var(--medieval-brown-dark), 6px 6px 12px rgba(0, 0, 0, 0.5)',
						marginBottom: '1rem',
						letterSpacing: '3px'
					}}>
						🎭 MEDIEVAL GAME SHOW 🎭
					</h1>

					<p style={{
						fontFamily: "'Crimson Text', serif",
						fontSize: '1.5rem',
						color: 'var(--light-color)',
						textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
						maxWidth: '600px',
						margin: '0 auto'
					}}>
						Welcome to the ultimate game show experience! Track scores, spin the wheel of destiny, and crown your champion.
					</p>
				</div>

				{/* Quick Status */}
				{winner && (
					<div style={{
						background: 'linear-gradient(135deg, var(--gold-color) 0%, var(--warning-color) 100%)',
						padding: '1.5rem',
						borderRadius: '20px',
						marginBottom: '2rem',
						color: 'var(--deep-brown)',
						fontFamily: "'Cinzel', serif",
						fontSize: '1.3rem',
						fontWeight: 'bold',
						border: '3px solid var(--deep-brown)',
						boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
					}}>
						{winner === 'tie' ? (
							<>🤝 Current Status: It&apos;s a Tie! 🤝</>
						) : (
							<>👑 Current Leader: {typeof winner === 'string' ? winner : winner.name} 👑</>
						)}
					</div>
				)}

				{/* Navigation Cards */}
				<div style={{ 
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '2rem',
					marginBottom: '3rem'
				}}>
					{/* Scores Card */}
					<Link 
						href="/scores"
						style={{ textDecoration: 'none' }}
					>
						<div style={{
							background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
							padding: '2rem',
							borderRadius: '20px',
							border: '3px solid var(--deep-brown)',
							boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
							transition: 'all 0.3s ease',
							cursor: 'pointer',
							height: '200px',
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
							<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
							<h2 style={{
								fontFamily: "'Cinzel', serif",
								fontSize: '1.8rem',
								color: 'var(--deep-brown)',
								marginBottom: '0.5rem'
							}}>
								Score Board
							</h2>
							<p style={{
								fontFamily: "'Crimson Text', serif",
								color: 'var(--dark-color)',
								fontSize: '1.1rem'
							}}>
								Track player scores and manage the game
							</p>
						</div>
					</Link>

					{/* Wheel Card */}
					<Link 
						href="/wheel"
						style={{ textDecoration: 'none' }}
					>
						<div style={{
							background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
							padding: '2rem',
							borderRadius: '20px',
							border: '3px solid var(--deep-brown)',
							boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
							transition: 'all 0.3s ease',
							cursor: 'pointer',
							height: '200px',
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
							<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
							<h2 style={{
								fontFamily: "'Cinzel', serif",
								fontSize: '1.8rem',
								color: 'var(--deep-brown)',
								marginBottom: '0.5rem'
							}}>
								Spinning Wheel
							</h2>
							<p style={{
								fontFamily: "'Crimson Text', serif",
								color: 'var(--dark-color)',
								fontSize: '1.1rem'
							}}>
								Spin the wheel of destiny
							</p>
						</div>
					</Link>
				</div>

				{/* Quick Scores Preview */}
				<div style={{
					background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--tan-color) 100%)',
					border: '3px solid var(--deep-brown)',
					borderRadius: '15px',
					padding: '1.5rem',
					marginBottom: '2rem',
					boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
				}}>
					<h3 style={{
						fontFamily: "'MedievalSharp', cursive",
						color: 'var(--deep-brown)',
						fontSize: '1.5rem',
						marginBottom: '1rem'
					}}>
						Current Scores
					</h3>
					<div style={{ 
						display: 'flex',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
						gap: '1rem'
					}}>
						{players.map((player) => (
							<div key={player.id} style={{
								fontFamily: "'Cinzel', serif",
								fontSize: '1.2rem',
								color: 'var(--dark-color)'
							}}>
								<strong>{player.name}:</strong> {player.score}
							</div>
						))}
					</div>
				</div>

				{/* Instructions */}
				<div className="user-directions-banner">
					<h4>
						<span style={{ marginRight: '0.5rem' }}>🎮</span>
						Quick Start Guide
					</h4>
					<p>
						<strong>1. Score Board:</strong> Set up player names and track scores throughout the game
					</p>
					<p>
						<strong>2. Spinning Wheel:</strong> Spin to determine game actions and outcomes
					</p>
					<p>
						<strong>Keyboard Shortcuts:</strong> Press{' '}
						<span className="shortcut">F1</span> for Scores or{' '}
						<span className="shortcut">F2</span> for Wheel
					</p>
				</div>
			</div>
		</div>
	);
}
