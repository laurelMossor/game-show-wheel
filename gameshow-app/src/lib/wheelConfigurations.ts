/**
 * Wheel Configurations
 * Predefined wheel segment configurations for different game modes
 */

import { GameAction } from '@/types/game';

/**
 * Type for wheel segment configuration (without color and calculated angle)
 */
export type WheelSegmentConfig = {
	text: string;
	action: GameAction;
	id?: number;
};

/**
 * 4-Segment Wheel Configuration
 * Simple difficulty-based wheel
 */
export const WHEEL_CONFIG_4_SEGMENTS: WheelSegmentConfig[] = [
	{ text: "Easy Mode", action: "new_rule" },
	{ text: "Medium Mode", action: "audience_choice" },
	{ text: "Hard Mode", action: "challenge" },
	{ text: "Extreme Mode", action: "destroy_rule_self" }
];

/**
 * 6-Segment Wheel Configuration
 * Rule modification focused wheel (default configuration)
 */
export const WHEEL_CONFIG_6_SEGMENTS: WheelSegmentConfig[] = [
	{ text: "Destroy Rule (self)", action: "destroy_rule_self" },
	{ text: "Audience Choice", action: "audience_choice" },
	{ text: "Swap", action: "swap" },
	{ text: "Shift 1 to Right", action: "shift_1_right" },
	{ text: "Opposite Rule", action: "opposite_rule" },
	{ text: "Destroy Rule (other)", action: "destroy_rule_other" }
];

/**
 * 8-Segment Wheel Configuration
 * Extended rule modification wheel with new rule options
 */
export const WHEEL_CONFIG_8_SEGMENTS: WheelSegmentConfig[] = [
	{ text: "Destroy Rule (self)", action: "destroy_rule_self" },
	{ text: "Audience Choice", action: "audience_choice" },
	{ text: "Swap", action: "swap" },
	{ text: "Shift 1 to Right", action: "shift_1_right" },
	{ text: "Opposite Rule", action: "opposite_rule" },
	{ text: "Destroy Rule (other)", action: "destroy_rule_other" },
	{ text: "New Rule (self)", action: "new_rule_self" },
	{ text: "New Rule (other)", action: "new_rule_other" }
];

/**
 * 12-Segment Wheel Configuration
 * Comprehensive wheel with all action types
 */
export const WHEEL_CONFIG_12_SEGMENTS: WheelSegmentConfig[] = [
	{ text: "Destroy Rule (self)", action: "destroy_rule_self" },
	{ text: "Audience Choice", action: "audience_choice" },
	{ text: "Swap", action: "swap" },
	{ text: "Shift 1 to Right", action: "shift_1_right" },
	{ text: "Opposite Rule", action: "opposite_rule" },
	{ text: "Destroy Rule (other)", action: "destroy_rule_other" },
	{ text: "New Rule (self)", action: "new_rule_self" },
	{ text: "New Rule (other)", action: "new_rule_other" },
	{ text: "Challenge", action: "challenge" },
	{ text: "Duplicate", action: "duplicate" },
	{ text: "Reverse", action: "reverse" },
	{ text: "New Rule", action: "new_rule" }
];

/**
 * Original V1 Wheel Configuration (11 segments)
 * Preserved for backward compatibility
 */
export const WHEEL_CONFIG_ORIGINAL: WheelSegmentConfig[] = [
	{ text: "New Rule", action: "new_rule" },
	{ text: "New Rule", action: "new_rule" },
	{ text: "New Rule", action: "new_rule" },
	{ text: "Modify: Audience Choice", action: "audience_choice" },
	{ text: "Modify: Audience Choice", action: "audience_choice" },
	{ text: "Challenge", action: "challenge" },
	{ text: "Challenge", action: "challenge" },
	{ text: "Challenge", action: "challenge" },
	{ text: "Modify: Duplicate", action: "duplicate" },
	{ text: "Modify: Reverse", action: "reverse" },
	{ text: "Modify: Swap", action: "swap" }
];

/**
 * All available wheel configurations
 * Useful for displaying options or cycling through configurations
 */
export const ALL_WHEEL_CONFIGS = {
	'4-segment': WHEEL_CONFIG_4_SEGMENTS,
	'6-segment': WHEEL_CONFIG_6_SEGMENTS,
	'8-segment': WHEEL_CONFIG_8_SEGMENTS,
	'12-segment': WHEEL_CONFIG_12_SEGMENTS,
	'original': WHEEL_CONFIG_ORIGINAL
} as const;

/**
 * Get a wheel configuration by name
 */
export function getWheelConfig(name: keyof typeof ALL_WHEEL_CONFIGS): WheelSegmentConfig[] {
	return ALL_WHEEL_CONFIGS[name];
}

/**
 * Get all available configuration names
 */
export function getAvailableConfigs(): string[] {
	return Object.keys(ALL_WHEEL_CONFIGS);
}

