'use client';

import { useRef, useEffect, useCallback } from 'react';
import { addWoodGrainTexture, addWoodGrainToSlat, drawSegmentText } from '@/utils/canvasDrawing';

interface WheelSegment {
	text: string;
	color: string;
}

interface WheelCanvasProps {
	segments: WheelSegment[];
	currentRotation: number;
	canvasSize: number;
	className?: string;
	style?: React.CSSProperties;
}

export default function WheelCanvas({ 
	segments, 
	currentRotation, 
	canvasSize,
	className = '',
	style = {}
}: WheelCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
		addWoodGrainTexture(ctx, {
			centerX,
			centerY,
			radius: outerRadius,
			width: 25
		});

		// Draw the inner wooden ring (inner frame)
		const innerRadius = radius - 25;
		ctx.beginPath();
		ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
		ctx.fillStyle = '#8B4513';
		ctx.fill();

		// Add wood grain texture to the inner ring
		addWoodGrainTexture(ctx, {
			centerX,
			centerY,
			radius: innerRadius,
			width: 25
		});

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
			addWoodGrainToSlat(ctx, {
				startX: slatStartX,
				startY: slatStartY,
				endX: slatEndX,
				endY: slatEndY,
				width: 8
			});
		});

		// Draw text on segments
		segments.forEach((segment, index) => {
			const startAngle = index * segmentAngle + (currentRotation * Math.PI / 180);
			const textAngle = startAngle + segmentAngle / 2;
			const textRadius = radius * 0.7;
			const textX = centerX + Math.cos(textAngle) * textRadius;
			const textY = centerY + Math.sin(textAngle) * textRadius;

			drawSegmentText(ctx, segment.text, textX, textY, textAngle, {
				fontSize: 20,
				fontFamily: '"Cinzel", serif',
				color: '#2C3E50',
				maxWordsPerLine: 2,
				lineHeight: 24
			});
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
		addWoodGrainTexture(ctx, {
			centerX,
			centerY,
			radius: centerRadius,
			width: centerRadius
		});
	}, [segments, currentRotation, canvasSize]);

	useEffect(() => {
		if (segments.length > 0) {
			drawWheel();
		}
	}, [segments, currentRotation, drawWheel]);

	return (
		<canvas
			ref={canvasRef}
			width={canvasSize}
			height={canvasSize}
			className={className}
			style={{
				borderRadius: '50%',
				boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
				border: '5px solid var(--deep-brown)',
				maxWidth: '100%',
				height: 'auto',
				...style
			}}
		/>
	);
}
