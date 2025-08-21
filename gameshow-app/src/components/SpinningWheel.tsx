'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useWheel } from '@/hooks/useWheel';


interface SpinningWheelProps {
	onSpinResult: (result: string) => void;
}

export default function SpinningWheel({ onSpinResult }: SpinningWheelProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [currentRotation, setCurrentRotation] = useState(0);

	// Use the wheel hook for state management
	const { 
		segments, 
		canvasSize, 
		isSpinning, 
		startSpin,
		stopSpin,
		calculateWinnerAtPosition
	} = useWheel();

	const drawWheel = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || segments.length === 0) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const centerX = canvasSize / 2;
		const centerY = canvasSize / 2;
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

		// Note: Pointer is now handled by the leaf icon positioned outside the canvas
	}, [segments, currentRotation, canvasSize]);

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

	useEffect(() => {
		if (segments.length > 0) {
			drawWheel();
		}
	}, [segments, currentRotation, drawWheel]);

	const animateWheel = useCallback((targetRotation: number, onComplete: (finalRotation: number) => void) => {
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
				onComplete(newRotation);
			}
		};

		requestAnimationFrame(animate);
	}, [currentRotation]);

	// Removed snap-to-center animation - wheel stops at natural position

	const spinWheel = useCallback(() => {
		if (isSpinning || segments.length === 0) return;

		try {
			// Get spin parameters from wheel manager
			const spinParams = startSpin();
			
			// Calculate the target rotation
			const targetRotation = currentRotation + spinParams.totalRotation;

			// Animate the wheel to the random stop position
			animateWheel(targetRotation, (finalRotation: number) => {
				// Calculate the winner based on where the wheel actually stopped
				const result = calculateWinnerAtPosition(finalRotation, false);
				
				// Stop spinning and announce the winner immediately
				stopSpin();
				onSpinResult(result.winnerText);
			});

		} catch (error) {
			console.error('Spin failed:', error);
			stopSpin(); // Make sure to clear spinning state on error
		}
	}, [isSpinning, segments.length, startSpin, stopSpin, currentRotation, onSpinResult, animateWheel, calculateWinnerAtPosition]);

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
	}, [isSpinning, spinWheel]);

	return (
		<div style={{ textAlign: 'center' }}>
			<div style={{ position: 'relative', display: 'inline-block', margin: '1.5rem 0' }}>
				<canvas
					ref={canvasRef}
					width={canvasSize}
					height={canvasSize}
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
