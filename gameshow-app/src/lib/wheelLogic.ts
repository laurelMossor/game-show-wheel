/**
* Wheel Logic Management
* Handles spinning wheel mechanics, segments, and results
*/

import { WheelSegment, SpinResult, WheelConfig } from '@/types/game';

// Original wheel segments configuration from V1 (preserved for posterity)
const ORIGINAL_SEGMENTS: Omit<WheelSegment, 'color'>[] = [
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

// New wheel segments configuration with 6 sections
const DEFAULT_SEGMENTS: Omit<WheelSegment, 'color'>[] = [
	{ id: 0, text: "Destroy Rule (self)", action: "destroy_rule_self", angle: 0 },
	{ id: 1, text: "Audience Choice", action: "audience_choice", angle: 60 },
	{ id: 2, text: "Swap", action: "swap", angle: 120 },
	{ id: 3, text: "Shift 1 to Right", action: "shift_1_right", angle: 180 },
	{ id: 4, text: "Opposite Rule", action: "opposite_rule", angle: 240 },
	{ id: 5, text: "Destroy Rule (other)", action: "destroy_rule_other", angle: 300 }
];

// Soft color palette for wheel segments
const SOFT_COLORS = [
	'#F8F9FA',  // Very light white
	'#F1F3F4',  // Light gray-white
	'#F5F5DC',  // Light beige
	'#F0E68C',  // Light khaki
	'#F0F8FF',  // Light azure
	'#F0FFF0'   // Light honeydew
];

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
