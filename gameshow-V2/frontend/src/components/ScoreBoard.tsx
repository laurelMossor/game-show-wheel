'use client';

import PlayerCard from './PlayerCard';

interface Player {
  id: number;
  name: string;
  score: number;
}

interface ScoreBoardProps {
  players: Player[];
  onUpdateScore: (playerId: number, change: number) => void;
}

export default function ScoreBoard({ players, onUpdateScore }: ScoreBoardProps) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '2rem', 
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {players.map(player => (
        <PlayerCard 
          key={player.id}
          player={player}
          onUpdateScore={onUpdateScore}
        />
      ))}
    </div>
  );
}
