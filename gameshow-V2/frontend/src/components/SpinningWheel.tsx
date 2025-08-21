'use client';

import { useState, useRef, useEffect } from 'react';

interface WheelSegment {
  id: number;
  text: string;
  action: string;
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

  // Default wheel segments from V1
  const defaultSegments = [
    { id: 0, text: "New Rule", action: "new_rule", angle: 0 },
    { id: 1, text: "New Rule", action: "new_rule", angle: 30 },
    { id: 2, text: "New Rule", action: "new_rule", angle: 60 },
    { id: 3, text: "Modify: Audience Choice", action: "audience_choice", angle: 90 },
    { id: 4, text: "Modify: Audience Choice", action: "audience_choice", angle: 120 },
    { id: 5, text: "Challenge", action: "challenge", angle: 150 },
    { id: 6, text: "Challenge", action: "challenge", angle: 180 },
    { id: 7, text: "Challenge", action: "challenge", angle: 210 },
    { id: 8, text: "Modify: Duplicate", action: "duplicate", angle: 240 },
    { id: 9, text: "Modify: Reverse", action: "reverse", angle: 270 },
    { id: 10, text: "Modify: Swap", action: "swap", angle: 300 }
  ];

  // Soft color palette for wheel segments
  const softColors = [
    '#F8F9FA',  // Very light white
    '#F1F3F4',  // Light gray-white
    '#F5F5DC',  // Light beige
    '#F0E68C',  // Light khaki
    '#F0F8FF',  // Light azure
    '#F0FFF0',  // Light honeydew
    '#F5FFFA',  // Light mint cream
    '#FFF8DC',  // Light cornsilk
    '#FDF5E6',  // Light old lace
    '#F0F8FF',  // Light alice blue
    '#F5F5F5'   // Light gray
  ];

  const getRandomSoftColor = () => {
    return softColors[Math.floor(Math.random() * softColors.length)];
  };

  useEffect(() => {
    // Initialize segments with randomized colors
    const wheelSegments = defaultSegments.map((segment, index) => ({
      ...segment,
      color: getRandomSoftColor(),
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
    const radius = Math.min(centerX, centerY) - 45;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the outer wooden ring first (water wheel frame)
    const outerRadius = radius + 25;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513'; // Saddle brown
    ctx.fill();
    
    // Add wood grain texture to the outer ring
    addWoodGrainTexture(ctx, centerX, centerY, outerRadius, 25);
    
    // Draw the inner wooden ring (inner frame)
    const innerRadius = radius - 25;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513';
    ctx.fill();
    
    // Add wood grain texture to the inner ring
    addWoodGrainTexture(ctx, centerX, centerY, innerRadius, 25);

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
      
      // Fill segment with soft color
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      // Draw wooden slat between segments (thick wooden divider)
      const slatAngle = startAngle + segmentAngle;
      const slatStartX = centerX + Math.cos(slatAngle) * (innerRadius + 5);
      const slatStartY = centerY + Math.sin(slatAngle) * (innerRadius + 5);
      const slatEndX = centerX + Math.cos(slatAngle) * (outerRadius - 5);
      const slatEndY = centerY + Math.sin(slatAngle) * (outerRadius - 5);
      
      ctx.beginPath();
      ctx.moveTo(slatStartX, slatStartY);
      ctx.lineTo(slatEndX, slatEndY);
      ctx.strokeStyle = '#A0522D'; // Sienna
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Add wood grain to the slat
      addWoodGrainToSlat(ctx, slatStartX, slatStartY, slatEndX, slatEndY, 8);
    });
    
    // Draw text on segments
    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + (currentRotation * Math.PI / 180);
      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;
      
      ctx.save();
      ctx.translate(textX, textY);
      // Rotate text to be vertical like a wheel spoke (from center to edge)
      ctx.rotate(textAngle);
      
      // Enhanced text styling with bigger, bolder text
      ctx.fillStyle = '#2C3E50'; // Dark blue-gray for better readability
      ctx.font = 'bold 20px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw text with subtle shadow for depth
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Handle long text by splitting into multiple lines
      const words = segment.text.split(' ');
      const lineHeight = 24;
      
      if (words.length > 2) {
        // Split into multiple lines
        let currentLine = '';
        let lineCount = 0;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
          if (testLine.length > 8 && currentLine) {
            // Draw current line
            ctx.fillText(currentLine, 0, lineCount * lineHeight - (words.length - 1) * lineHeight / 2);
            lineCount++;
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        // Draw last line
        if (currentLine) {
          ctx.fillText(currentLine, 0, lineCount * lineHeight - (words.length - 1) * lineHeight / 2);
        }
      } else {
        ctx.fillText(segment.text, 0, 0);
      }
      
      ctx.restore();
    });
    
    // Draw center circle with wooden styling
    const centerRadius = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add wood grain to center circle
    addWoodGrainTexture(ctx, centerX, centerY, centerRadius, centerRadius);
  };

  // Function to add wood grain texture to circular elements
  const addWoodGrainTexture = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, width: number) => {
    // Create subtle wood grain effect with darker lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const startX = centerX + Math.cos(angle) * (radius - width / 2);
      const startY = centerY + Math.sin(angle) * (radius - width / 2);
      const endX = centerX + Math.cos(angle) * (radius + width / 2);
      const endY = centerY + Math.sin(angle) * (radius + width / 2);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Function to add wood grain to slats
  const addWoodGrainToSlat = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, width: number) => {
    // Create wood grain lines along the slat
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const segments = Math.floor(length / 10);
    
    for (let i = 0; i < segments; i++) {
      const progress = i / segments;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      
      // Perpendicular line for wood grain
      const perpX = x + Math.cos(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (width / 2);
      const perpY = y + Math.sin(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (width / 2);
      const perpEndX = x + Math.cos(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (-width / 2);
      const perpEndY = y + Math.sin(Math.atan2(endY - startY, endX - startX) + Math.PI / 2) * (-width / 2);
      
      ctx.beginPath();
      ctx.moveTo(perpX, perpY);
      ctx.lineTo(perpEndX, perpEndY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  };

  const spinWheel = async () => {
    if (isSpinning || segments.length === 0) return;
    
    setIsSpinning(true);
    
    try {
      // Simple, predictable spin force like V1
      const baseRotations = 5; // Always spin about 5 full rotations
      const extraRotations = Math.random() * 2; // Add 0-2 extra rotations for variety
      
      // Calculate the target segment (random selection)
      const targetSegmentIndex = Math.floor(Math.random() * segments.length);
      const segmentAngle = 360 / segments.length;
      const targetAngle = targetSegmentIndex * segmentAngle;
      
      // Calculate how many full rotations we want
      const totalRotations = (baseRotations + extraRotations) * 360;
      
      // Add a small offset to ensure pointer lands clearly in the target segment
      const offset = (Math.random() * 0.5 + 0.25) * segmentAngle; // 0.25 to 0.75 of segment
      
      // Calculate the final target rotation
      const finalRotation = currentRotation + totalRotations + targetAngle + offset;
      
      // Animate the spin
      animateWheel(finalRotation, () => {
        setIsSpinning(false);
        
        // Calculate which segment won based on the final rotation
        const segmentAngle = 360 / segments.length;
        const normalizedRotation = (currentRotation % 360 + 360) % 360;
        
        // The leaf icon points to the right (3 o'clock position)
        const rightPosition = 0;
        let adjustedRotation = (rightPosition - normalizedRotation * Math.PI / 180) % (2 * Math.PI);
        if (adjustedRotation < 0) adjustedRotation += 2 * Math.PI;
        
        const segmentIndex = Math.floor(adjustedRotation / (segmentAngle * Math.PI / 180)) % segments.length;
        const selectedSegment = segments[segmentIndex];
        
        if (selectedSegment) {
          onSpinResult(selectedSegment.text.toUpperCase());
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
      
      // Simple, natural wheel physics: starts fast, slows down naturally
      const easeValue = 1 - Math.pow(1 - progress, 2); // Quadratic ease-out
      
      // Calculate rotation
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

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (!isSpinning) {
          spinWheel();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', margin: '1.5rem 0' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          style={{
            borderRadius: '50%',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
            border: '5px solid var(--deep-brown)',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
        {/* Leaf Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-15px',
            transform: 'translateY(-50%)',
            zIndex: 10,
            fontSize: '2.5rem',
            color: '#228B22', // Deep green
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
          }}
        >
          🌱
        </div>
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`btn btn-primary ${isSpinning ? '' : ''}`}
          style={{
            opacity: isSpinning ? 0.6 : 1,
            cursor: isSpinning ? 'not-allowed' : 'pointer'
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>▶️</span>
          {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
        </button>
      </div>
    </div>
  );
}
