'use client';

import PlayerCard from './PlayerCard';
import { Player, ScoreUpdate } from '@/types/game';

interface ScoreBoardProps {
  players: Player[];
  onUpdateScore: (update: ScoreUpdate) => void;
  onUpdatePlayerName?: (playerId: string, name: string) => void;
}

export default function ScoreBoard({ players, onUpdateScore, onUpdatePlayerName }: ScoreBoardProps) {
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
          onUpdateScore={(points: number) => onUpdateScore({ playerId: player.id, points })}
          onUpdatePlayerName={onUpdatePlayerName ? (name: string) => onUpdatePlayerName(player.id, name) : undefined}
        />
      ))}
    </div>
  );
}
