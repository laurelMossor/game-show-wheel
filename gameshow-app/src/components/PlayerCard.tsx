'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types/game';

interface PlayerCardProps {
	player: Player;
	onUpdateScore: (points: number) => void;
	onUpdatePlayerName?: (name: string) => void;
}

export default function PlayerCard({ player, onUpdateScore, onUpdatePlayerName }: PlayerCardProps) {
	const [isEditingName, setIsEditingName] = useState(false);
	const [editName, setEditName] = useState(player.name);
	const [isEditingScore, setIsEditingScore] = useState(false);
	const [editScore, setEditScore] = useState(player.score.toString());

	// Sync editScore with player.score changes
	useEffect(() => {
		setEditScore(player.score.toString());
		}, [player.score]);

	// Sync editName with player.name changes
	useEffect(() => {
		setEditName(player.name);
		}, [player.name]);

	const handleNameSubmit = () => {
		if (onUpdatePlayerName && editName.trim()) {
			onUpdatePlayerName(editName.trim());
			setIsEditingName(false);
		}
	};

	const handleNameKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleNameSubmit();
		} else if (e.key === 'Escape') {
			setEditName(player.name);
			setIsEditingName(false);
		}
	};

	const handleScoreSubmit = () => {
		const newScore = parseInt(editScore);
		if (!isNaN(newScore)) {
			const scoreDiff = newScore - player.score;
			onUpdateScore(scoreDiff);
		}
		setIsEditingScore(false);
	};

	const handleScoreKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleScoreSubmit();
		} else if (e.key === 'Escape') {
			setEditScore(player.score.toString());
			setIsEditingScore(false);
		}
	};

	return (
		<div>
			{/* Player Header */}
			<div style={{ marginBottom: '1.5rem', position: 'relative' }}>
		<div style={{ marginBottom: '0.5rem' }}>
			{/* Player Name */}
			{isEditingName ? (
				<input
					type="text"
					value={editName}
					onChange={(e) => setEditName(e.target.value)}
					onBlur={handleNameSubmit}
					onKeyDown={handleNameKeyPress}
					autoFocus
					style={{
						background: 'rgba(255, 255, 255, 0.5)',
						border: '2px solid var(--gold-color)',
						borderRadius: '10px',
						padding: '0.5rem 1rem',
						fontSize: '1.5rem',
						fontWeight: 'bold',
						color: 'var(--deep-brown)',
						textTransform: 'uppercase',
						letterSpacing: '1px',
						fontFamily: "'MedievalSharp', cursive",
						textAlign: 'center',
						width: '100%',
						transition: 'all 0.3s ease',
						cursor: 'text',
						boxShadow: '0 0 15px rgba(218, 165, 32, 0.3)'
					}}
				/>
			) : (
				<input
					type="text"
					value={player.name}
					readOnly
					onClick={() => onUpdatePlayerName && setIsEditingName(true)}
					style={{
						background: 'transparent',
						border: '2px solid transparent',
						borderRadius: '10px',
						padding: '0.5rem 1rem',
						fontSize: '1.5rem',
						fontWeight: 'bold',
						color: 'var(--deep-brown)',
						textTransform: 'uppercase',
						letterSpacing: '1px',
						fontFamily: "'MedievalSharp', cursive",
						textAlign: 'center',
						width: '100%',
						transition: 'all 0.3s ease',
						cursor: onUpdatePlayerName ? 'pointer' : 'default'
					}}
					onMouseEnter={(e) => {
						if (onUpdatePlayerName) {
							e.currentTarget.style.borderColor = 'var(--deep-brown)';
							e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
						}
					}}
					onMouseLeave={(e) => {
						if (onUpdatePlayerName) {
							e.currentTarget.style.borderColor = 'transparent';
							e.currentTarget.style.background = 'transparent';
						}
					}}
					title={onUpdatePlayerName ? 'Click to edit name' : ''}
				/>
			)}
		</div>
			</div>

			{/* Favor Display */}
			<div style={{
		marginBottom: '2rem',
		padding: '1.5rem',
		background: 'linear-gradient(135deg, var(--light-color) 0%, var(--cream-color) 100%)',
		borderRadius: '15px',
		border: '2px solid var(--tan-color)'
			}}>
		<div style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: '0.5rem'
		}}>
			{isEditingScore ? (
				<input
					type="number"
					value={editScore}
					onChange={(e) => setEditScore(e.target.value)}
					onBlur={handleScoreSubmit}
					onKeyDown={handleScoreKeyPress}
					autoFocus
					style={{
						background: 'rgba(255, 255, 255, 0.5)',
						border: '2px solid var(--gold-color)',
						borderRadius: '10px',
						padding: '0.5rem 1rem',
						fontSize: '3rem',
						fontWeight: 'bold',
						color: 'var(--deep-brown)',
						textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
						fontFamily: "'Cinzel', serif",
						textAlign: 'center',
						width: '140px',
						transition: 'all 0.3s ease',
						boxShadow: '0 0 15px rgba(218, 165, 32, 0.3)',
						outline: 'none'
					}}
					className="number-input-with-spinner"
				/>
			) : (
				<input
					type="number"
					value={player.score}
					readOnly
					onClick={() => setIsEditingScore(true)}
					style={{
						background: 'transparent',
						border: 'none',
						borderRadius: '10px',
						padding: '0.5rem 1rem',
						fontSize: '3rem',
						fontWeight: 'bold',
						color: 'var(--deep-brown)',
						textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
						fontFamily: "'Cinzel', serif",
						textAlign: 'center',
						width: '140px',
						transition: 'all 0.3s ease',
						cursor: 'pointer',
						outline: 'none'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'transparent';
					}}
					title="Click to edit score"
				/>
			)}
		</div>
		<span style={{
			display: 'block',
			fontSize: '0.9rem',
			color: 'var(--secondary-color)',
			textTransform: 'uppercase',
			letterSpacing: '2px',
			fontWeight: 600,
			fontFamily: "'Crimson Text', serif"
		}}>
			FAVOR
		</span>
			</div>
		</div>
	);
}
