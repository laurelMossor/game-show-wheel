/**
 * Wheel Configurations Tests
 * Tests for the wheelConfigurations module
 */

import {
	WHEEL_CONFIG_4_SEGMENTS,
	WHEEL_CONFIG_6_SEGMENTS,
	WHEEL_CONFIG_8_SEGMENTS,
	WHEEL_CONFIG_12_SEGMENTS,
	WHEEL_CONFIG_ORIGINAL,
	ALL_WHEEL_CONFIGS,
	getWheelConfig,
	getAvailableConfigs,
	WheelSegmentConfig
} from '../wheelConfigurations';
import { GameAction } from '@/types/game';

describe('Wheel Configurations', () => {
	/**
	 * Tests that all predefined configurations are valid and have correct segment counts.
	 */
	test('should have correct segment counts for all configurations', () => {
		expect(WHEEL_CONFIG_4_SEGMENTS).toHaveLength(4);
		expect(WHEEL_CONFIG_6_SEGMENTS).toHaveLength(6);
		expect(WHEEL_CONFIG_8_SEGMENTS).toHaveLength(8);
		expect(WHEEL_CONFIG_12_SEGMENTS).toHaveLength(12);
		expect(WHEEL_CONFIG_ORIGINAL).toHaveLength(11);
	});

	/**
	 * Tests that all configurations have valid GameAction types.
	 */
	test('should have valid GameAction types in all configurations', () => {
		const allConfigs = [
			WHEEL_CONFIG_4_SEGMENTS,
			WHEEL_CONFIG_6_SEGMENTS,
			WHEEL_CONFIG_8_SEGMENTS,
			WHEEL_CONFIG_12_SEGMENTS,
			WHEEL_CONFIG_ORIGINAL
		];

		allConfigs.forEach(config => {
			config.forEach(segment => {
				expect(segment).toHaveProperty('text');
				expect(segment).toHaveProperty('action');
				expect(typeof segment.text).toBe('string');
				expect(typeof segment.action).toBe('string');
			});
		});
	});

	/**
	 * Tests that configurations have proper structure.
	 */
	test('should have proper WheelSegmentConfig structure', () => {
		const testConfig: WheelSegmentConfig[] = WHEEL_CONFIG_6_SEGMENTS;
		
		testConfig.forEach(segment => {
			expect(segment.text).toBeDefined();
			expect(segment.action).toBeDefined();
			// id is optional
			if (segment.id !== undefined) {
				expect(typeof segment.id).toBe('number');
			}
		});
	});

	/**
	 * Tests the ALL_WHEEL_CONFIGS object contains all configurations.
	 */
	test('should contain all configurations in ALL_WHEEL_CONFIGS', () => {
		expect(ALL_WHEEL_CONFIGS['4-segment']).toBe(WHEEL_CONFIG_4_SEGMENTS);
		expect(ALL_WHEEL_CONFIGS['6-segment']).toBe(WHEEL_CONFIG_6_SEGMENTS);
		expect(ALL_WHEEL_CONFIGS['8-segment']).toBe(WHEEL_CONFIG_8_SEGMENTS);
		expect(ALL_WHEEL_CONFIGS['12-segment']).toBe(WHEEL_CONFIG_12_SEGMENTS);
		expect(ALL_WHEEL_CONFIGS['original']).toBe(WHEEL_CONFIG_ORIGINAL);
	});

	/**
	 * Tests the getWheelConfig function.
	 */
	test('should get wheel configurations by name', () => {
		expect(getWheelConfig('4-segment')).toBe(WHEEL_CONFIG_4_SEGMENTS);
		expect(getWheelConfig('6-segment')).toBe(WHEEL_CONFIG_6_SEGMENTS);
		expect(getWheelConfig('8-segment')).toBe(WHEEL_CONFIG_8_SEGMENTS);
		expect(getWheelConfig('12-segment')).toBe(WHEEL_CONFIG_12_SEGMENTS);
		expect(getWheelConfig('original')).toBe(WHEEL_CONFIG_ORIGINAL);
	});

	/**
	 * Tests the getAvailableConfigs function.
	 */
	test('should return all available configuration names', () => {
		const configs = getAvailableConfigs();
		
		expect(configs).toContain('4-segment');
		expect(configs).toContain('6-segment');
		expect(configs).toContain('8-segment');
		expect(configs).toContain('12-segment');
		expect(configs).toContain('original');
		expect(configs).toHaveLength(5);
	});

	/**
	 * Tests that 6-segment configuration has expected content.
	 */
	test('should have expected content in 6-segment configuration', () => {
		expect(WHEEL_CONFIG_6_SEGMENTS[0]).toMatchObject({
			text: "Destroy Rule (self)",
			action: "destroy_rule_self"
		});
		expect(WHEEL_CONFIG_6_SEGMENTS[1]).toMatchObject({
			text: "Audience Choice",
			action: "audience_choice"
		});
		expect(WHEEL_CONFIG_6_SEGMENTS[5]).toMatchObject({
			text: "Destroy Rule (other)",
			action: "destroy_rule_other"
		});
	});

	/**
	 * Tests that 8-segment configuration includes the new rule options.
	 */
	test('should have new rule options in 8-segment configuration', () => {
		const actions = WHEEL_CONFIG_8_SEGMENTS.map(s => s.action);
		
		expect(actions).toContain('new_rule_self');
		expect(actions).toContain('new_rule_other');
		expect(WHEEL_CONFIG_8_SEGMENTS[6]).toMatchObject({
			text: "New Rule (self)",
			action: "new_rule_self"
		});
		expect(WHEEL_CONFIG_8_SEGMENTS[7]).toMatchObject({
			text: "New Rule (other)",
			action: "new_rule_other"
		});
	});

	/**
	 * Tests that original configuration matches V1 structure.
	 */
	test('should preserve original V1 configuration structure', () => {
		expect(WHEEL_CONFIG_ORIGINAL).toHaveLength(11);
		
		const actions = WHEEL_CONFIG_ORIGINAL.map(s => s.action);
		const newRuleCount = actions.filter(a => a === 'new_rule').length;
		const audienceChoiceCount = actions.filter(a => a === 'audience_choice').length;
		const challengeCount = actions.filter(a => a === 'challenge').length;
		
		expect(newRuleCount).toBe(3);
		expect(audienceChoiceCount).toBe(2);
		expect(challengeCount).toBe(3);
	});
});
