'use client';

import { useState } from 'react';
import GradientCard from './common/GradientCard';

interface LoginFormProps {
	onLogin: (password: string) => boolean;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		const success = onLogin(password);
		if (!success) {
			setError('Incorrect password');
			setPassword('');
		}
	};

	return (
		<div className="game-container">
			<div style={{ 
				maxWidth: '400px', 
				margin: '0 auto',
				padding: '20px',
				textAlign: 'center'
			}}>
				<h1 style={{ 
					fontSize: '2.5rem', 
					marginBottom: '2rem',
					color: '#8B4513'
				}}>
					🏰 Admin Access
				</h1>
				
				<GradientCard>
					<form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
						<div style={{ marginBottom: '1.5rem' }}>
							<label htmlFor="password" style={{ 
								display: 'block', 
								marginBottom: '0.5rem',
								color: '#8B4513',
								fontWeight: 'bold'
							}}>
								Enter Password:
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								style={{
									width: '100%',
									padding: '0.75rem',
									fontSize: '1rem',
									border: '2px solid #D2691E',
									borderRadius: '8px',
									textAlign: 'center'
								}}
								placeholder="Password required"
								autoFocus
							/>
						</div>
						
						{error && (
							<div style={{ 
								color: '#DC143C', 
								marginBottom: '1rem',
								fontWeight: 'bold'
							}}>
								{error}
							</div>
						)}
						
						<button
							type="submit"
							style={{
								backgroundColor: '#8B4513',
								color: 'white',
								padding: '0.75rem 2rem',
								fontSize: '1rem',
								border: 'none',
								borderRadius: '8px',
								cursor: 'pointer',
								fontWeight: 'bold'
							}}
						>
							Enter Admin Area
						</button>
					</form>
				</GradientCard>

				<div style={{ 
					marginTop: '2rem',
					padding: '1rem',
					backgroundColor: '#F5DEB3',
					borderRadius: '8px',
					border: '2px solid #D2691E'
				}}>
					<p style={{ margin: 0, color: '#8B4513' }}>
						Looking for guest access? <br/>
						<a href="/guest" style={{ color: '#8B4513', textDecoration: 'underline' }}>
							Visit the Guest Area
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}


