/**
* Wheel Logic Management
* Handles spinning wheel mechanics, segments, and results
*/

import { WheelSegment, SpinResult, WheelConfig, GameAction } from '@/types/game';
import { WHEEL_CONFIG_8_SEGMENTS } from './wheelConfigurations';

// Default wheel segments configuration with 8 sections (using utility function)
const DEFAULT_SEGMENTS: Omit<WheelSegment, 'color'>[] = generateWheelSegments(WHEEL_CONFIG_8_SEGMENTS);

// Soft color palette for wheel segments
const SOFT_COLORS = [
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
	'#F5F5F5',  // Light gray
	'#FFE4E1',  // Light misty rose
	'#F0FFFF'   // Light azure
];

/**
 * Utility function to generate wheel segments with dynamic count and auto-calculated angles
 * @param segmentConfigs Array of segment configurations (text, action, id)
 * @param startAngle Starting angle for the first segment (default: 0)
 * @returns Array of wheel segments with calculated angles and random colors
 */
export function generateWheelSegments(
	segmentConfigs: Array<{ text: string; action: GameAction; id?: number }>,
	startAngle: number = 0
): Omit<WheelSegment, 'color'>[] {
	const segmentCount = segmentConfigs.length;
	const segmentAngle = 360 / segmentCount;
	
	return segmentConfigs.map((config, index) => ({
		id: config.id ?? index,
		text: config.text,
		action: config.action,
		angle: startAngle + (index * segmentAngle)
	}));
}

// Configuration constants
const DEFAULT_CONFIG: WheelConfig = {
	segments: [],
	canvasSize: 600,
	spinDuration: 3000,
	minSpins: 3,
	maxSpins: 8,
};

export class WheelManager {
	private config: WheelConfig;
	private isSpinning: boolean = false;

	constructor() {
		this.config = { ...DEFAULT_CONFIG };
		this.initializeSegments();
	}

	/**
	* Get random soft color
	*/
	private getRandomSoftColor(): string {
		return SOFT_COLORS[Math.floor(Math.random() * SOFT_COLORS.length)];
	}

	/**
	* Initialize wheel segments with randomized colors
	*/
	private initializeSegments(): void {
		this.config.segments = DEFAULT_SEGMENTS.map((segment, index) => ({
			...segment,
			color: this.getRandomSoftColor(),
			angle: (360 / DEFAULT_SEGMENTS.length) * index
		}));
	}

	/**
	* Get wheel configuration
	*/
	getConfig(): WheelConfig {
		return { ...this.config };
	}

	/**
	* Get all wheel segments
	*/
	getSegments(): WheelSegment[] {
		return [...this.config.segments];
	}

	/**
	* Randomize segment colors
	*/
	randomizeColors(): void {
		this.config.segments.forEach(segment => {
			segment.color = this.getRandomSoftColor();
		});
	}

	/**
	* Randomize segment order
	*/
	randomizeSegments(): void {
		// Shuffle segments using Fisher-Yates algorithm
		const segments = [...this.config.segments];
		for (let i = segments.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[segments[i], segments[j]] = [segments[j], segments[i]];
		}

		// Recalculate angles for shuffled segments
		const segmentAngle = 360 / segments.length;
		segments.forEach((segment, index) => {
			segment.angle = index * segmentAngle;
			segment.color = this.getRandomSoftColor();
		});

		this.config.segments = segments;
	}

	/**
	* Generate spin parameters for animation
	*/
	generateSpin(): { totalRotation: number; duration: number } {
		// Calculate spin parameters
		const baseRotations = 5; // Always spin about 5 full rotations
		const extraRotations = Math.random() * 2; // Add 0-2 extra rotations
		const totalRotations = (baseRotations + extraRotations) * 360;

		// Generate a random final angle (where the wheel stops)
		const randomFinalAngle = Math.random() * 360;
		const totalRotation = totalRotations + randomFinalAngle;

		return {
			totalRotation,
			duration: this.config.spinDuration
		};
	}

	/**
	* Calculate winner based on final wheel position and optionally snap to center
	*/
	calculateWinnerAtPosition(finalRotation: number, snapToCenter: boolean = true): SpinResult {
		const segmentAngle = 360 / this.config.segments.length;
		
		// Normalize the rotation
		const normalizedRotation = ((finalRotation % 360) + 360) % 360;
		
		// Calculate the effective rotation for determining the winning segment
		// The pointer is at 90 degrees (3 o'clock position)
		const effectiveRotation = (360 - normalizedRotation) % 360;
		const segmentIndex = Math.floor(effectiveRotation / segmentAngle) % this.config.segments.length;
		const selectedSegment = this.config.segments[segmentIndex];

		let adjustedRotation = finalRotation;
		
		if (snapToCenter) {
			// Calculate the center angle of the winning segment
			const segmentCenterAngle = segmentIndex * segmentAngle + (segmentAngle / 2);
			
			// Calculate how much we need to adjust to center the segment at the pointer
			const targetRotation = (360 - segmentCenterAngle) % 360;
			const currentEffectiveRotation = effectiveRotation % 360;
			
			// Find the smallest adjustment needed
			let adjustment = (targetRotation - currentEffectiveRotation + 360) % 360;
			if (adjustment > 180) adjustment -= 360;
			
			adjustedRotation = finalRotation + adjustment;
		}

		const result: SpinResult = {
			segment: selectedSegment,
			finalAngle: adjustedRotation,
			duration: this.config.spinDuration,
			winnerText: selectedSegment.text.toUpperCase()
		};

		return result;
	}

	/**
	* Start spinning - sets spinning state
	*/
	startSpin(): void {
		this.isSpinning = true;
	}

	/**
	* Stop spinning - clears spinning state
	*/
	stopSpin(): void {
		this.isSpinning = false;
	}

	/**
	* Legacy spin method for compatibility - now just generates spin parameters
	*/
	generateSpinParams(): { totalRotation: number; duration: number } {
		return this.generateSpin();
	}

	/**
	* Check if wheel is currently spinning
	*/
	getIsSpinning(): boolean {
		return this.isSpinning;
	}

	/**
	* Update spin duration
	*/
	setSpinDuration(duration: number): void {
		this.config.spinDuration = Math.max(1000, Math.min(10000, duration));
	}

	/**
	* Get wheel statistics
	*/
	getStats() {
		const actionCounts = this.config.segments.reduce((acc, segment) => {
			acc[segment.action] = (acc[segment.action] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return {
			totalSegments: this.config.segments.length,
			actions: Object.keys(actionCounts),
			actionCounts,
			spinDuration: this.config.spinDuration,
			isSpinning: this.isSpinning
		};
	}

	/**
	* Reset to default configuration
	*/
	resetToDefaults(): void {
		this.config = { ...DEFAULT_CONFIG };
		this.initializeSegments();
		this.isSpinning = false;
	}

	/**
	* Set wheel configuration with any number of segments
	* Automatically calculates angles based on the number of segments provided
	* @param segmentConfigs Array of segment configurations (text, action, optional id)
	* @param startAngle Optional starting angle for the first segment (default: 0)
	*/
	setWheelSegments(
		segmentConfigs: Array<{ text: string; action: GameAction; id?: number }>,
		startAngle: number = 0
	): void {
		const segments = generateWheelSegments(segmentConfigs, startAngle);
		this.config.segments = segments.map((segment) => ({
			...segment,
			color: this.getRandomSoftColor()
		}));
	}

	/**
	* Calculate which segment the pointer is pointing to based on rotation
	*/
	getSegmentAtAngle(rotation: number): WheelSegment | null {
		const normalizedRotation = ((rotation % 360) + 360) % 360;
		const segmentAngle = 360 / this.config.segments.length;

		// The pointer points to the right (3 o'clock position = 90 degrees)
		// We need to find which segment is at that position
		const effectiveRotation = (360 - normalizedRotation) % 360;
		const segmentIndex = Math.floor(effectiveRotation / segmentAngle) % this.config.segments.length;

		return this.config.segments[segmentIndex] || null;
	}
}

// Export singleton instance
export const wheelManager = new WheelManager();
