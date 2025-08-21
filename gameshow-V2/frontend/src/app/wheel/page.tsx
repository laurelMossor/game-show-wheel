'use client';

import { useState } from 'react';
import SpinningWheel from '../../components/SpinningWheel';

export default function WheelPage() {
  const [result, setResult] = useState<string>('');

  const handleSpinResult = (wheelResult: string) => {
    setResult(wheelResult);
  };

  return (
    <div className="game-container">
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Spinning Wheel</h1>
      <SpinningWheel onSpinResult={handleSpinResult} />
      {result && (
        <div style={{ 
          marginTop: '2rem', 
          fontSize: '2rem', 
          fontWeight: 'bold',
          color: '#4ecdc4'
        }}>
          Result: {result}
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/" 
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontSize: '1.2rem'
          }}
        >
          Back to Scores
        </a>
      </div>
    </div>
  );
}
