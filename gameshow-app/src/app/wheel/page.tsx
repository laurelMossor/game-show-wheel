'use client';

import { useState } from 'react';
import Link from 'next/link';
import SpinningWheel from '../../components/SpinningWheel';

export default function WheelPage() {
	const [result, setResult] = useState<string>('');
	const [isBlinking, setIsBlinking] = useState(false);

	const handleSpinResult = (wheelResult: string) => {
		setResult(wheelResult);
		// Add blinking effect when result is displayed
		setIsBlinking(true);
		// Remove blinking after 5 seconds
		setTimeout(() => setIsBlinking(false), 5000);
	};

	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '1200px', 
				margin: '0 auto',
				padding: '20px'
			}}>
				{/* Result Banner */}
				<div style={{ 
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '1.5rem'
				}}>
					<div style={{
						padding: '20px',
						height: '80px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						maxWidth: '800px'
					}}>
						<div 
							id="result-text"
							className={`result-text ${isBlinking ? 'blinking' : ''}`}
							style={{
								fontFamily: "'MedievalSharp', cursive",
								fontSize: '2.5rem',
								fontWeight: 'bold',
								color: isBlinking ? 'transparent' : 'var(--medieval-gold)',
								textShadow: isBlinking ? 'none' : '2px 2px 0px var(--medieval-brown-dark), 4px 4px 8px rgba(0, 0, 0, 0.5)',
								letterSpacing: '2px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: '60px',
								padding: '10px 20px',
								lineHeight: '1',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								textTransform: 'uppercase'
							}}
						>
							{result || ''}
						</div>
					</div>
				</div>

				{/* Wheel Section */}
				<div style={{ 
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '2rem'
				}}>
					<div style={{
						background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
						padding: '1.5rem',
						borderRadius: '20px',
						border: '3px solid var(--deep-brown)',
						boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
						textAlign: 'center',
						maxWidth: '800px',
						width: '100%'
					}}>
						<SpinningWheel onSpinResult={handleSpinResult} />
					</div>
				</div>

				{/* User Directions Banner */}
				<div style={{ 
					display: 'flex',
					justifyContent: 'center'
				}}>
					<div className="user-directions-banner" style={{ maxWidth: '800px', width: '100%' }}>
						<h4>
							<span style={{ marginRight: '0.5rem' }}>ℹ️</span>
							How to Use the Wheel
						</h4>
						<p>
							<strong>Spin the Wheel:</strong> Click the SPIN button or press{' '}
							<span className="shortcut">Space</span> or{' '}
							<span className="shortcut">Enter</span>
						</p>
						<p>
							<strong>Navigation:</strong> Use{' '}
							<span className="shortcut">F1</span> for Scores,{' '}
							<span className="shortcut">F2</span> for Wheel
						</p>
						<div style={{ marginTop: '1rem', textAlign: 'center' }}>
							<Link 
								href="/"
								className="btn btn-secondary"
								style={{ textDecoration: 'none' }}
							>
								<span style={{ marginRight: '0.5rem' }}>📊</span>
								Back to Scores
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
