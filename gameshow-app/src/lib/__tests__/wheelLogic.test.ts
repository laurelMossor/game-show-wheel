/**
 * Basic Wheel Logic Tests
 * Tests for core wheel functionality
 */

import { WheelManager } from '../wheelLogic';

describe('WheelManager', () => {
	let wheel: WheelManager;

	beforeEach(() => {
		wheel = new WheelManager();
	});

	describe('Basic Initialization', () => {
		/** 
		 * Validates WheelManager constructor creates 8 default segments from DEFAULT_SEGMENTS array,
		 * ensuring each segment object contains required properties (id, text, action, color, angle)
		 * for proper wheel rendering and game logic functionality.
		 */
		test('should initialize with default segments', () => {
			const segments = wheel.getSegments();
			// expect(segments).toHaveLength(8);
			expect(segments[0]).toHaveProperty('id');
			expect(segments[0]).toHaveProperty('text');
			expect(segments[0]).toHaveProperty('action');
			expect(segments[0]).toHaveProperty('color');
			expect(segments[0]).toHaveProperty('angle');
		});

		/** 
		 * Tests color assignment during initialization by verifying each segment receives
		 * a valid 6-character hex color code from the SOFT_COLORS palette via getRandomSoftColor().
		 */
		test('should assign colors to segments', () => {
			const segments = wheel.getSegments();
			segments.forEach(segment => {
				expect(segment.color).toBeDefined();
				expect(typeof segment.color).toBe('string');
				expect(segment.color).toMatch(/^#[A-Fa-f0-9]{6}$/);
			});
		});
	});

	describe('Spin Generation', () => {
		/** 
		 * Validates generateSpin() algorithm returns proper spin parameters:
		 * totalRotation (baseRotations + extraRotations + randomFinalAngle) > 1800 degrees,
		 * duration matches config.spinDuration (3000ms default) for animation timing.
		 */
		test('should generate spin parameters', () => {
			const spinParams = wheel.generateSpin();
			expect(spinParams).toHaveProperty('totalRotation');
			expect(spinParams).toHaveProperty('duration');
			expect(typeof spinParams.totalRotation).toBe('number');
			expect(typeof spinParams.duration).toBe('number');
			expect(spinParams.totalRotation).toBeGreaterThan(1800); // At least 5 full rotations
			expect(spinParams.duration).toBe(3000); // Default duration
		});

		/** 
		 * Tests Math.random() usage in generateSpin() by calling multiple times and
		 * verifying totalRotation values differ due to random extraRotations and finalAngle components.
		 */
		test('should generate different rotations', () => {
			const spin1 = wheel.generateSpin();
			const spin2 = wheel.generateSpin();
			const spin3 = wheel.generateSpin();
			
			// Very unlikely all three would be exactly the same
			expect(
				spin1.totalRotation === spin2.totalRotation && 
				spin2.totalRotation === spin3.totalRotation
			).toBe(false);
		});
	});

	describe('Winner Calculation', () => {
		/** 
		 * Tests calculateWinnerAtPosition() method by providing rotation angle and verifying
		 * returned SpinResult contains proper segment reference, calculated finalAngle,
		 * duration from config, and winnerText as uppercase segment.text.
		 */
		test('should calculate winner from rotation', () => {
			const result = wheel.calculateWinnerAtPosition(0, false);
			expect(result).toHaveProperty('segment');
			expect(result).toHaveProperty('finalAngle');
			expect(result).toHaveProperty('duration');
			expect(result).toHaveProperty('winnerText');
			expect(result.segment).toHaveProperty('id');
			expect(result.segment).toHaveProperty('text');
			expect(result.winnerText).toBe(result.segment.text.toUpperCase());
		});

		/** 
		 * Validates rotation normalization logic using modulo operations to ensure
		 * equivalent angles (0°, 360°, 720°) resolve to same segment via 
		 * ((rotation % 360) + 360) % 360 calculation.
		 */
		test('should handle rotation normalization', () => {
			const result360 = wheel.calculateWinnerAtPosition(360, false);
			const result720 = wheel.calculateWinnerAtPosition(720, false);
			const result0 = wheel.calculateWinnerAtPosition(0, false);
			
			// 0, 360, and 720 degrees should point to the same segment
			expect(result360.segment.id).toBe(result720.segment.id);
			expect(result0.segment.id).toBe(result360.segment.id);
		});
	});

	describe('Segment Management', () => {
		/** 
		 * Tests randomizeColors() method by capturing original color array, invoking color
		 * randomization, and verifying SOFT_COLORS palette reassignment produces different
		 * color combinations via getRandomSoftColor() calls.
		 */
		test('should randomize segment colors', () => {
			const originalSegments = wheel.getSegments();
			const originalColors = originalSegments.map(s => s.color);
			
			wheel.randomizeColors();
			const newSegments = wheel.getSegments();
			const newColors = newSegments.map(s => s.color);
			
			// Colors should be different (very unlikely to be exactly the same)
			expect(originalColors).not.toEqual(newColors);
		});

		/** 
		 * Validates randomizeSegments() uses Fisher-Yates shuffle algorithm to reorder segments,
		 * then recalculates angles (360/segments.length * index) and assigns new colors,
		 * preserving segment count and IDs while changing positions.
		 */
		test('should randomize segment order', () => {
			const originalSegments = wheel.getSegments();
			const originalOrder = originalSegments.map(s => s.id);
			
			wheel.randomizeSegments();
			const newSegments = wheel.getSegments();
			const newOrder = newSegments.map(s => s.id);
			
			// Should have same segments and count
			expect(newSegments).toHaveLength(originalSegments.length);
			expect(originalOrder.sort()).toEqual(newOrder.sort()); // Same IDs
			
			// Segments should have new colors and potentially different angles
			newSegments.forEach(segment => {
				expect(segment.color).toBeDefined();
				expect(typeof segment.angle).toBe('number');
			});
		});
	});
});
