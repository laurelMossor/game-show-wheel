/**
 * Extensible Wheel Configuration Tests
 * Tests the new extensible wheel configuration system
 */

import { WheelManager } from '../wheelLogic';
import { WHEEL_CONFIG_4_SEGMENTS, WHEEL_CONFIG_6_SEGMENTS, WHEEL_CONFIG_8_SEGMENTS, WHEEL_CONFIG_12_SEGMENTS } from '../wheelConfigurations';
import { GameAction } from '@/types/game';

describe('Extensible Wheel Configuration System', () => {
	let wheelManager: WheelManager;

	beforeEach(() => {
		wheelManager = new WheelManager();
	});

	/**
	 * Tests that the main setWheelSegments function works with any number of segments
	 * and automatically calculates correct angles based on segment count.
	 */
	test('should handle any number of segments with automatic angle calculation', () => {
		// Test 3 segments
		const config3 = [
			{ text: "Action 1", action: "new_rule" as GameAction },
			{ text: "Action 2", action: "audience_choice" as GameAction },
			{ text: "Action 3", action: "challenge" as GameAction }
		];
		wheelManager.setWheelSegments(config3);
		expect(wheelManager.getSegments()).toHaveLength(3);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(120);
		expect(wheelManager.getSegments()[2].angle).toBe(240);

		// Test 5 segments
		const config5 = [
			{ text: "Action 1", action: "new_rule" as GameAction },
			{ text: "Action 2", action: "audience_choice" as GameAction },
			{ text: "Action 3", action: "challenge" as GameAction },
			{ text: "Action 4", action: "duplicate" as GameAction },
			{ text: "Action 5", action: "reverse" as GameAction }
		];
		wheelManager.setWheelSegments(config5);
		expect(wheelManager.getSegments()).toHaveLength(5);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(72);
		expect(wheelManager.getSegments()[2].angle).toBe(144);
		expect(wheelManager.getSegments()[3].angle).toBe(216);
		expect(wheelManager.getSegments()[4].angle).toBe(288);

		// Test 7 segments
		const config7 = [
			{ text: "Action 1", action: "new_rule" as GameAction },
			{ text: "Action 2", action: "audience_choice" as GameAction },
			{ text: "Action 3", action: "challenge" as GameAction },
			{ text: "Action 4", action: "duplicate" as GameAction },
			{ text: "Action 5", action: "reverse" as GameAction },
			{ text: "Action 6", action: "swap" as GameAction },
			{ text: "Action 7", action: "destroy_rule_self" as GameAction }
		];
		wheelManager.setWheelSegments(config7);
		expect(wheelManager.getSegments()).toHaveLength(7);
		// Each segment should be 360/7 ≈ 51.43 degrees apart
		const expectedAngle = 360 / 7;
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBeCloseTo(expectedAngle, 1);
		expect(wheelManager.getSegments()[6].angle).toBeCloseTo(expectedAngle * 6, 1);
	});

	/**
	 * Tests that predefined configurations work correctly with the new system.
	 */
	test('should work with all predefined configurations', () => {
		// Test 4-segment configuration
		wheelManager.setWheelSegments(WHEEL_CONFIG_4_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(4);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(90);
		expect(wheelManager.getSegments()[2].angle).toBe(180);
		expect(wheelManager.getSegments()[3].angle).toBe(270);

		// Test 6-segment configuration
		wheelManager.setWheelSegments(WHEEL_CONFIG_6_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(6);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(60);
		expect(wheelManager.getSegments()[5].angle).toBe(300);

		// Test 8-segment configuration
		wheelManager.setWheelSegments(WHEEL_CONFIG_8_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(8);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(45);
		expect(wheelManager.getSegments()[7].angle).toBe(315);

		// Test 12-segment configuration
		wheelManager.setWheelSegments(WHEEL_CONFIG_12_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(12);
		expect(wheelManager.getSegments()[0].angle).toBe(0);
		expect(wheelManager.getSegments()[1].angle).toBe(30);
		expect(wheelManager.getSegments()[11].angle).toBe(330);
	});

	/**
	 * Tests that the same function works for different predefined configurations.
	 */
	test('should use same function for different predefined configurations', () => {
		// Use the single setWheelSegments function with 6-segment config
		wheelManager.setWheelSegments(WHEEL_CONFIG_6_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(6);
		expect(wheelManager.getSegments()[0].text).toBe("Destroy Rule (self)");

		// Use the same function with 8-segment config
		wheelManager.setWheelSegments(WHEEL_CONFIG_8_SEGMENTS);
		expect(wheelManager.getSegments()).toHaveLength(8);
		expect(wheelManager.getSegments()[0].text).toBe("Destroy Rule (self)");
		expect(wheelManager.getSegments()[6].text).toBe("New Rule (self)");
	});

	/**
	 * Tests custom start angles with different segment counts.
	 */
	test('should handle custom start angles with any segment count', () => {
		const config = [
			{ text: "Action 1", action: "new_rule" as GameAction },
			{ text: "Action 2", action: "audience_choice" as GameAction },
			{ text: "Action 3", action: "challenge" as GameAction }
		];

		// Test with start angle of 90 degrees
		wheelManager.setWheelSegments(config, 90);
		expect(wheelManager.getSegments()[0].angle).toBe(90);
		expect(wheelManager.getSegments()[1].angle).toBe(210);
		expect(wheelManager.getSegments()[2].angle).toBe(330);

		// Test with start angle of 180 degrees
		wheelManager.setWheelSegments(config, 180);
		expect(wheelManager.getSegments()[0].angle).toBe(180);
		expect(wheelManager.getSegments()[1].angle).toBe(300);
		expect(wheelManager.getSegments()[2].angle).toBe(420); // 180 + (2 * 120) = 420
	});

	/**
	 * Tests that segments maintain proper properties after configuration changes.
	 */
	test('should maintain proper segment properties after configuration changes', () => {
		const config = [
			{ text: "Custom Action", action: "destroy_rule_self" as GameAction, id: 999 },
			{ text: "Another Action", action: "new_rule_other" as GameAction }
		];

		wheelManager.setWheelSegments(config);
		const segments = wheelManager.getSegments();

		expect(segments).toHaveLength(2);
		expect(segments[0]).toMatchObject({
			id: 999,
			text: "Custom Action",
			action: "destroy_rule_self",
			angle: 0
		});
		expect(segments[1]).toMatchObject({
			id: 1, // Auto-assigned since not provided
			text: "Another Action",
			action: "new_rule_other",
			angle: 180
		});

		// All segments should have colors assigned
		segments.forEach(segment => {
			expect(segment.color).toBeDefined();
			expect(typeof segment.color).toBe('string');
			expect(segment.color).toMatch(/^#[A-Fa-f0-9]{6}$/);
		});
	});
});
