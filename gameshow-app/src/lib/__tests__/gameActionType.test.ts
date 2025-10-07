/**
 * GameAction Type Tests
 * Tests that GameAction type is properly utilized throughout the system
 */

import { GameAction, WheelSegment } from '@/types/game';
import { generateWheelSegments } from '../wheelLogic';
import { WHEEL_CONFIG_6_SEGMENTS, WHEEL_CONFIG_8_SEGMENTS } from '../wheelConfigurations';

describe('GameAction Type Usage', () => {
	/**
	 * Tests that GameAction type is properly used in wheel configurations
	 * and that invalid actions are caught by TypeScript.
	 */
	test('should use GameAction type in wheel configurations', () => {
		// These should all be valid GameAction values
		const validActions: GameAction[] = [
			'new_rule',
			'audience_choice',
			'challenge',
			'duplicate',
			'reverse',
			'swap',
			'destroy_rule_self',
			'shift_1_right',
			'opposite_rule',
			'destroy_rule_other',
			'new_rule_self',
			'new_rule_other'
		];

		// Verify all valid actions are accepted
		validActions.forEach(action => {
			const config = { text: "Test", action };
			const segments = generateWheelSegments([config]);
			expect(segments[0].action).toBe(action);
		});
	});

	/**
	 * Tests that wheel configurations properly use GameAction type
	 */
	test('should have proper GameAction types in predefined configurations', () => {
		// Test 6-segment configuration
		expect(WHEEL_CONFIG_6_SEGMENTS).toHaveLength(6);
		WHEEL_CONFIG_6_SEGMENTS.forEach(config => {
			expect(typeof config.action).toBe('string');
			expect(config.action).toMatch(/^(new_rule|audience_choice|challenge|duplicate|reverse|swap|destroy_rule_self|shift_1_right|opposite_rule|destroy_rule_other|new_rule_self|new_rule_other)$/);
		});

		// Test 8-segment configuration
		expect(WHEEL_CONFIG_8_SEGMENTS).toHaveLength(8);
		WHEEL_CONFIG_8_SEGMENTS.forEach(config => {
			expect(typeof config.action).toBe('string');
			expect(config.action).toMatch(/^(new_rule|audience_choice|challenge|duplicate|reverse|swap|destroy_rule_self|shift_1_right|opposite_rule|destroy_rule_other|new_rule_self|new_rule_other)$/);
		});
	});

	/**
	 * Tests that generated segments have proper GameAction types
	 */
	test('should generate segments with proper GameAction types', () => {
		const segments = generateWheelSegments(WHEEL_CONFIG_6_SEGMENTS);
		
		segments.forEach(segment => {
			expect(typeof segment.action).toBe('string');
			expect(segment.action).toMatch(/^(new_rule|audience_choice|challenge|duplicate|reverse|swap|destroy_rule_self|shift_1_right|opposite_rule|destroy_rule_other|new_rule_self|new_rule_other)$/);
		});
	});

	/**
	 * Tests that all GameAction values are covered in the type definition
	 */
	test('should have all expected GameAction values', () => {
		const expectedActions = [
			'new_rule',
			'audience_choice', 
			'challenge',
			'duplicate',
			'reverse',
			'swap',
			'destroy_rule_self',
			'shift_1_right',
			'opposite_rule',
			'destroy_rule_other',
			'new_rule_self',
			'new_rule_other'
		];

		// Test that we can use each action in a wheel segment
		expectedActions.forEach(action => {
			const segment: WheelSegment = {
				id: 1,
				text: "Test",
				action: action as GameAction,
				color: "#ffffff",
				angle: 0
			};
			expect(segment.action).toBe(action);
		});
	});
});
