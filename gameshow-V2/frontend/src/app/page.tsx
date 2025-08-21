'use client';

import { useState, useEffect } from 'react';
import ScoreBoard from '../components/ScoreBoard';

interface Player {
  id: number;
  name: string;
  score: number;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
  ]);

  const updateScore = async (playerId: number, change: number) => {
    const newPlayers = players.map(player => 
      player.id === playerId 
        ? { ...player, score: Math.max(0, player.score + change) }
        : player
    );
    setPlayers(newPlayers);

    // Send to backend (will work once Flask is running)
    try {
      await fetch('/api/scores/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, score: newPlayers.find(p => p.id === playerId)?.score })
      });
    } catch (error) {
      console.log('Backend not available yet:', error);
    }
  };

  return (
    <div className="game-container">
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Game Show Scores</h1>
      <ScoreBoard players={players} onUpdateScore={updateScore} />
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/wheel" 
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontSize: '1.2rem'
          }}
        >
          Go to Wheel
        </a>
      </div>
    </div>
  );
}
