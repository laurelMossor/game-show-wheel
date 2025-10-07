/**
 * Wheel Utility Tests
 * Tests for the generateWheelSegments utility function
 */

import { generateWheelSegments } from '../wheelLogic';
import { GameAction } from '@/types/game';

describe('generateWheelSegments Utility', () => {
	/**
	 * Tests that the utility function correctly generates segments with proper angle calculations
	 * for different segment counts, ensuring angles are evenly distributed around the wheel.
	 */
	test('should generate segments with correct angles for 6 segments', () => {
		const configs = [
			{ text: "Segment 1", action: "new_rule" as GameAction },
			{ text: "Segment 2", action: "audience_choice" as GameAction },
			{ text: "Segment 3", action: "challenge" as GameAction },
			{ text: "Segment 4", action: "duplicate" as GameAction },
			{ text: "Segment 5", action: "reverse" as GameAction },
			{ text: "Segment 6", action: "swap" as GameAction }
		];

		const segments = generateWheelSegments(configs);
		
		expect(segments).toHaveLength(6);
		expect(segments[0].angle).toBe(0);
		expect(segments[1].angle).toBe(60);
		expect(segments[2].angle).toBe(120);
		expect(segments[3].angle).toBe(180);
		expect(segments[4].angle).toBe(240);
		expect(segments[5].angle).toBe(300);
	});

	/**
	 * Tests that the utility function correctly generates segments with proper angle calculations
	 * for 8 segments, ensuring angles are evenly distributed around the wheel.
	 */
	test('should generate segments with correct angles for 8 segments', () => {
		const configs = [
			{ text: "Segment 1", action: "new_rule" as GameAction },
			{ text: "Segment 2", action: "audience_choice" as GameAction },
			{ text: "Segment 3", action: "challenge" as GameAction },
			{ text: "Segment 4", action: "duplicate" as GameAction },
			{ text: "Segment 5", action: "reverse" as GameAction },
			{ text: "Segment 6", action: "swap" as GameAction },
			{ text: "Segment 7", action: "new_rule_self" as GameAction },
			{ text: "Segment 8", action: "new_rule_other" as GameAction }
		];

		const segments = generateWheelSegments(configs);
		
		expect(segments).toHaveLength(8);
		expect(segments[0].angle).toBe(0);
		expect(segments[1].angle).toBe(45);
		expect(segments[2].angle).toBe(90);
		expect(segments[3].angle).toBe(135);
		expect(segments[4].angle).toBe(180);
		expect(segments[5].angle).toBe(225);
		expect(segments[6].angle).toBe(270);
		expect(segments[7].angle).toBe(315);
	});

	/**
	 * Tests that the utility function correctly assigns IDs and preserves segment configuration data.
	 */
	test('should preserve segment configuration data', () => {
		const configs = [
			{ text: "Destroy Rule (self)", action: "destroy_rule_self" as GameAction, id: 10 },
			{ text: "Audience Choice", action: "audience_choice" as GameAction, id: 20 },
			{ text: "Swap", action: "swap" as GameAction }
		];

		const segments = generateWheelSegments(configs);
		
		expect(segments).toHaveLength(3);
		expect(segments[0]).toMatchObject({
			id: 10,
			text: "Destroy Rule (self)",
			action: "destroy_rule_self"
		});
		expect(segments[1]).toMatchObject({
			id: 20,
			text: "Audience Choice",
			action: "audience_choice"
		});
		expect(segments[2]).toMatchObject({
			id: 2, // Auto-assigned since not provided
			text: "Swap",
			action: "swap"
		});
	});

	/**
	 * Tests that the utility function correctly handles custom start angles.
	 */
	test('should handle custom start angles', () => {
		const configs = [
			{ text: "Segment 1", action: "new_rule" as GameAction },
			{ text: "Segment 2", action: "audience_choice" as GameAction }
		];

		const segments = generateWheelSegments(configs, 90); // Start at 90 degrees
		
		expect(segments).toHaveLength(2);
		expect(segments[0].angle).toBe(90);
		expect(segments[1].angle).toBe(270); // 90 + 180
	});
});
