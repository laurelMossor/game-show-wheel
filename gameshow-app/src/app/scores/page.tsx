'use client';

import { useGameState } from '@/hooks/useGameState';
import PlayerCard from '@/components/PlayerCard';
import ScoreBoard from '@/components/ScoreBoard';

export default function ScoresPage() {
  const { 
    players, 
    gameStarted, 
    updateScore, 
    updatePlayerName, 
    resetScores,
    resetGame,
    startGame,
    getWinner
  } = useGameState();

  const winner = getWinner();

  return (
    <div className="game-container">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontFamily: "'MedievalSharp', cursive",
            fontSize: '3rem',
            color: 'var(--medieval-gold)',
            textShadow: '2px 2px 0px var(--medieval-brown-dark), 4px 4px 8px rgba(0, 0, 0, 0.5)',
            marginBottom: '1rem'
          }}>
            🏆 GAME SHOW SCORES 🏆
          </h1>
          
          {winner && winner !== 'tie' && (
            <div style={{
              background: 'linear-gradient(135deg, var(--gold-color) 0%, var(--warning-color) 100%)',
              padding: '1rem',
              borderRadius: '15px',
              marginBottom: '1rem',
              color: 'var(--deep-brown)',
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              👑 {typeof winner === 'string' ? winner : winner.name} is Leading! 👑
            </div>
          )}
          
          {winner === 'tie' && (
            <div style={{
              background: 'linear-gradient(135deg, var(--info-color) 0%, var(--sage-green) 100%)',
              padding: '1rem',
              borderRadius: '15px',
              marginBottom: '1rem',
              color: 'white',
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              🤝 It's a Tie! 🤝
            </div>
          )}
        </div>

        {/* Score Board */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--light-color) 100%)',
            padding: '2rem',
            borderRadius: '20px',
            border: '3px solid var(--deep-brown)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '900px'
          }}>
            <ScoreBoard 
              players={players}
              onUpdateScore={updateScore}
              onUpdatePlayerName={updatePlayerName}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {!gameStarted && (
            <button
              onClick={startGame}
              className="btn btn-primary"
              style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
            >
              <span style={{ marginRight: '0.5rem' }}>🚀</span>
              Start Game
            </button>
          )}
          
          <button
            onClick={resetScores}
            className="btn btn-warning"
            style={{ 
              background: 'linear-gradient(45deg, var(--warning-color), var(--gold-color))',
              color: 'var(--deep-brown)'
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>🔄</span>
            Reset Scores
          </button>
          
          <button
            onClick={resetGame}
            className="btn btn-secondary"
          >
            <span style={{ marginRight: '0.5rem' }}>🎮</span>
            New Game
          </button>
          
          <a 
            href="/wheel"
            className="btn btn-primary"
            style={{ 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>🎯</span>
            Spin Wheel
          </a>
        </div>

        {/* Instructions */}
        <div className="user-directions-banner">
          <h4>
            <span style={{ marginRight: '0.5rem' }}>ℹ️</span>
            How to Play
          </h4>
          <p>
            <strong>Score Management:</strong> Click on player names to edit them, use +/- buttons to adjust scores
          </p>
          <p>
            <strong>Navigation:</strong> Use{' '}
            <span className="shortcut">F1</span> for Scores,{' '}
            <span className="shortcut">F2</span> for Wheel
          </p>
          <p>
            <strong>Game Flow:</strong> Start the game, spin the wheel, and track player scores throughout the game
          </p>
        </div>
      </div>
    </div>
  );
}
