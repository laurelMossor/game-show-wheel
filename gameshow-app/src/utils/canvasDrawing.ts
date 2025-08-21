// Canvas drawing utilities for the spinning wheel

export interface WoodGrainOptions {
	centerX: number;
	centerY: number;
	radius: number;
	width: number;
	lineCount?: number;
	opacity?: number;
	lineWidth?: number;
}

export interface SlatGrainOptions {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	width: number;
	segmentSize?: number;
	opacity?: number;
	lineWidth?: number;
}

/**
 * Adds wood grain texture to circular elements
 */
export function addWoodGrainTexture(
	ctx: CanvasRenderingContext2D, 
	options: WoodGrainOptions
): void {
	const { centerX, centerY, radius, width, lineCount = 8, opacity = 0.2, lineWidth = 1 } = options;
	
	// Create subtle wood grain effect with darker lines
	for (let i = 0; i < lineCount; i++) {
		const angle = (i * Math.PI) / 4;
		const startX = centerX + Math.cos(angle) * (radius - width / 2);
		const startY = centerY + Math.sin(angle) * (radius - width / 2);
		const endX = centerX + Math.cos(angle) * (radius + width / 2);
		const endY = centerY + Math.sin(angle) * (radius + width / 2);

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
}

/**
 * Adds wood grain texture to slats (dividers between wheel segments)
 */
export function addWoodGrainToSlat(
	ctx: CanvasRenderingContext2D, 
	options: SlatGrainOptions
): void {
	const { startX, startY, endX, endY, width, segmentSize = 10, opacity = 0.15, lineWidth = 0.5 } = options;
	
	// Create wood grain lines along the slat
	const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
	const segments = Math.floor(length / segmentSize);

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
		ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
}

/**
 * Draws text on wheel segments with proper line wrapping
 */
export function drawSegmentText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	angle: number,
	options: {
		fontSize?: number;
		fontFamily?: string;
		color?: string;
		maxWordsPerLine?: number;
		lineHeight?: number;
		shadowColor?: string;
		shadowBlur?: number;
		shadowOffset?: { x: number; y: number };
	} = {}
): void {
	const {
		fontSize = 20,
		fontFamily = '"Cinzel", serif',
		color = '#2C3E50',
		maxWordsPerLine = 2,
		lineHeight = 24,
		shadowColor = 'rgba(255, 255, 255, 0.8)',
		shadowBlur = 2,
		shadowOffset = { x: 1, y: 1 }
	} = options;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);

	// Enhanced text styling
	ctx.fillStyle = color;
	ctx.font = `bold ${fontSize}px ${fontFamily}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	// Draw text with shadow for depth
	ctx.shadowColor = shadowColor;
	ctx.shadowBlur = shadowBlur;
	ctx.shadowOffsetX = shadowOffset.x;
	ctx.shadowOffsetY = shadowOffset.y;

	// Handle long text by splitting into multiple lines
	const words = text.split(' ');

	if (words.length > maxWordsPerLine) {
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
		ctx.fillText(text, 0, 0);
	}

	ctx.restore();
}
