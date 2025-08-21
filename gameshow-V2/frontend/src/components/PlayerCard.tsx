'use client';

interface Player {
  id: number;
  name: string;
  score: number;
}

interface PlayerCardProps {
  player: Player;
  onUpdateScore: (playerId: number, change: number) => void;
}

export default function PlayerCard({ player, onUpdateScore }: PlayerCardProps) {
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    minWidth: '200px',
    backdropFilter: 'blur(10px)',
  };

  const scoreStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '1rem 0',
    color: '#4ecdc4',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{player.name}</h2>
      <div style={scoreStyle}>{player.score}</div>
      <div>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#ff6b6b', color: 'white' }}
          onClick={() => onUpdateScore(player.id, -10)}
        >
          -10
        </button>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#ff9ff3', color: 'white' }}
          onClick={() => onUpdateScore(player.id, -1)}
        >
          -1
        </button>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#54a0ff', color: 'white' }}
          onClick={() => onUpdateScore(player.id, 1)}
        >
          +1
        </button>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#5f27cd', color: 'white' }}
          onClick={() => onUpdateScore(player.id, 10)}
        >
          +10
        </button>
      </div>
    </div>
  );
}
