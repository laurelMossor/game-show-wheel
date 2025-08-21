'use client';

import { useState } from 'react';
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  onUpdateScore: (points: number) => void;
  onUpdatePlayerName?: (name: string) => void;
}

export default function PlayerCard({ player, onUpdateScore, onUpdatePlayerName }: PlayerCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(player.name);

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

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
      border: '3px solid var(--deep-brown)',
      borderRadius: '20px',
      padding: '2rem',
      minWidth: '250px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    }}>
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
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--deep-brown)',
            background: 'transparent',
            border: '2px solid var(--secondary-color)',
            borderRadius: '8px',
            padding: '0.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
            width: '100%'
          }}
        />
      ) : (
        <h2 
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--deep-brown)',
            marginBottom: '1rem',
            cursor: onUpdatePlayerName ? 'pointer' : 'default',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onClick={() => onUpdatePlayerName && setIsEditingName(true)}
          title={onUpdatePlayerName ? 'Click to edit name' : ''}
        >
          {player.name}
        </h2>
      )}

      {/* Score Display */}
      <div style={{
        fontFamily: "'MedievalSharp', cursive",
        fontSize: '3.5rem',
        fontWeight: 'bold',
        color: 'var(--medieval-gold)',
        textShadow: '2px 2px 0px var(--medieval-brown-dark), 4px 4px 8px rgba(0, 0, 0, 0.5)',
        margin: '1.5rem 0',
        letterSpacing: '2px'
      }}>
        {player.score}
      </div>

      {/* Score Controls */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        marginTop: '1.5rem'
      }}>
        <button 
          className="btn"
          style={{
            background: 'linear-gradient(45deg, var(--accent-color), #B22222)',
            color: 'white',
            fontSize: '1rem',
            padding: '0.75rem 1rem'
          }}
          onClick={() => onUpdateScore(-10)}
        >
          -10
        </button>
        <button 
          className="btn"
          style={{
            background: 'linear-gradient(45deg, var(--warning-color), var(--gold-color))',
            color: 'var(--deep-brown)',
            fontSize: '1rem',
            padding: '0.75rem 1rem'
          }}
          onClick={() => onUpdateScore(-1)}
        >
          -1
        </button>
        <button 
          className="btn"
          style={{
            background: 'linear-gradient(45deg, var(--success-color), var(--forest-green))',
            color: 'white',
            fontSize: '1rem',
            padding: '0.75rem 1rem'
          }}
          onClick={() => onUpdateScore(1)}
        >
          +1
        </button>
        <button 
          className="btn"
          style={{
            background: 'linear-gradient(45deg, var(--info-color), var(--sage-green))',
            color: 'white',
            fontSize: '1rem',
            padding: '0.75rem 1rem'
          }}
          onClick={() => onUpdateScore(10)}
        >
          +10
        </button>
      </div>
    </div>
  );
}
