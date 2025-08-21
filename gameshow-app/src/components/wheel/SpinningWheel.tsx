'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWheel } from '@/hooks/useWheel';
import WheelCanvas from './WheelCanvas';
import WheelPointer from './WheelPointer';
import SpinButton from './SpinButton';


interface SpinningWheelProps {
	onSpinResult: (result: string) => void;
}

export default function SpinningWheel({ onSpinResult }: SpinningWheelProps) {
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
				<WheelCanvas
					segments={segments}
					currentRotation={currentRotation}
					canvasSize={canvasSize}
				/>
				<WheelPointer />
			</div>

			<SpinButton
				isSpinning={isSpinning}
				onSpin={spinWheel}
			/>
		</div>
	);
}
