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
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
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

        {/* User Directions Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--cream-color) 0%, var(--tan-color) 100%)',
          border: '3px solid var(--deep-brown)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '20px',
            width: '20px',
            height: '20px',
            background: 'var(--deep-brown)',
            transform: 'rotate(45deg)',
            zIndex: -1
          }} />
          
          <h3 style={{
            color: 'var(--deep-brown)',
            fontFamily: "'MedievalSharp', cursive",
            fontSize: '1.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.8rem' }}>ℹ️</span>
            How to Use the Scoreboard
          </h3>
          
          <div style={{
            fontFamily: "'Crimson Text', serif",
            color: 'var(--dark-color)',
            lineHeight: 1.6
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Edit Names:</strong> Click on any player name to edit, press{' '}
              <span style={{
                background: 'var(--warm-yellow)',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                fontWeight: 'bold',
                color: 'var(--deep-brown)',
                border: '1px solid var(--deep-brown)',
                fontFamily: 'monospace'
              }}>Enter</span> to save or{' '}
              <span style={{
                background: 'var(--warm-yellow)',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                fontWeight: 'bold',
                color: 'var(--deep-brown)',
                border: '1px solid var(--deep-brown)',
                fontFamily: 'monospace'
              }}>Escape</span> to cancel
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Update Favor:</strong> Click on favor value to type directly, or use the up/down arrows in the input field
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Navigation:</strong> Use{' '}
              <span style={{
                background: 'var(--warm-yellow)',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                fontWeight: 'bold',
                color: 'var(--deep-brown)',
                border: '1px solid var(--deep-brown)',
                fontFamily: 'monospace'
              }}>F1</span> for Scores,{' '}
              <span style={{
                background: 'var(--warm-yellow)',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                fontWeight: 'bold',
                color: 'var(--deep-brown)',
                border: '1px solid var(--deep-brown)',
                fontFamily: 'monospace'
              }}>F2</span> for Wheel
            </p>
            
            <div style={{
              borderTop: '1px solid var(--deep-brown)',
              paddingTop: '1rem',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm"
                style={{
                  borderColor: 'var(--deep-brown)',
                  color: 'var(--deep-brown)',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(101, 67, 33, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--medieval-gold)';
                  e.currentTarget.style.color = 'var(--medieval-gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--deep-brown)';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                }}
                onClick={() => window.location.reload()}
              >
                <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🔄</span>
                Refresh Scores
              </button>
              <small style={{ 
                color: 'var(--secondary-color)', 
                marginLeft: '0.5rem',
                fontSize: '0.85rem'
              }}>
                Click to sync with server (preserves local changes)
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
