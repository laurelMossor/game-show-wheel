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
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '2rem',
            minHeight: '0',
            width: '100%'
        }}>
            {players.map((player, index) => (
                <div 
                    key={player.id}
                    style={{
                        background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
                        borderRadius: '20px',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        border: '3px solid var(--tan-color)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    className={`player-score-card player-score-card-${index}`}
                >
                    {/* Top accent bar */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: index === 0 ? 'var(--gold-color)' : 
                            index === 1 ? 'var(--silver-color)' : 
                            index === 2 ? 'var(--bronze-color)' : 
                            'linear-gradient(90deg, var(--gold-color), var(--silver-color), var(--bronze-color))'
                    }} />
                    
                    <PlayerCard 
                        player={player}
                        onUpdateScore={(points: number) => onUpdateScore({ playerId: player.id, points })}
                        onUpdatePlayerName={onUpdatePlayerName ? (name: string) => onUpdatePlayerName(player.id, name) : undefined}
                    />
                </div>
            ))}
        </div>
    );
}