'use client';

import { useState, useRef, useEffect } from 'react';

interface WheelSegment {
  text: string;
  color: string;
  angle: number;
}

interface SpinningWheelProps {
  onSpinResult: (result: string) => void;
}

export default function SpinningWheel({ onSpinResult }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [segments, setSegments] = useState<WheelSegment[]>([]);

  // Default wheel segments (simplified from V1)
  const defaultSegments = [
    'Lose a Turn',
    'Bankrupt',
    'Free Spin',
    '+100',
    '+200',
    '+300',
    '+500',
    '+1000'
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
  ];

  useEffect(() => {
    // Initialize segments with colors
    const wheelSegments = defaultSegments.map((text, index) => ({
      text,
      color: colors[index % colors.length],
      angle: (360 / defaultSegments.length) * index
    }));
    setSegments(wheelSegments);
  }, []);

  useEffect(() => {
    if (segments.length > 0) {
      drawWheel();
    }
  }, [segments, currentRotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || segments.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    const segmentAngle = (2 * Math.PI) / segments.length;
    
    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + (currentRotation * Math.PI / 180);
      const endAngle = (index + 1) * segmentAngle + (currentRotation * Math.PI / 180);
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill segment
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw text
      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(segment.text, 0, 0);
      
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  };

  const spinWheel = async () => {
    if (isSpinning || segments.length === 0) return;
    
    setIsSpinning(true);
    
    try {
      // Simple local spin (will connect to backend later)
      const spins = 5 + Math.random() * 3; // 5-8 full rotations
      const finalAngle = Math.random() * 360;
      const totalRotation = currentRotation + (spins * 360) + finalAngle;
      
      // Animate the spin
      animateWheel(totalRotation, () => {
        setIsSpinning(false);
        
        // Calculate which segment won
        const segmentAngle = 360 / segments.length;
        const normalizedAngle = (360 - (totalRotation % 360)) % 360;
        const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
        const winner = segments[segmentIndex];
        
        if (winner) {
          onSpinResult(winner.text);
        }
      });
      
    } catch (error) {
      console.error('Spin failed:', error);
      setIsSpinning(false);
    }
  };

  const animateWheel = (targetRotation: number, onComplete: () => void) => {
    const startRotation = currentRotation;
    const duration = 3000; // 3 seconds
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out animation
      const easeValue = 1 - Math.pow(1 - progress, 3);
      const newRotation = startRotation + (targetRotation - startRotation) * easeValue;
      
      setCurrentRotation(newRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            border: '3px solid #333',
            borderRadius: '50%',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}
        />
        {/* Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-15px',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            color: '#ff6b6b',
            zIndex: 10
          }}
        >
          ▶
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            backgroundColor: isSpinning ? '#666' : '#4ECDC4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {isSpinning ? 'Spinning...' : '🎯 SPIN THE WHEEL!'}
        </button>
      </div>
    </div>
  );
}
