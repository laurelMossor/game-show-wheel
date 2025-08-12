/**
 * Wheel Configuration
 * Centralized wheel segment definitions and configuration
 */

// Default wheel segments configuration
const DEFAULT_WHEEL_SEGMENTS = [
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

// Soft, light color palette for wheel segments
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
    '#F5F5F5'   // Light gray
];

// Action color mapping - now using soft, randomized colors
const ACTION_COLORS = {
    'new_rule': 'soft_random',           // Random soft color
    'audience_choice': 'soft_random',    // Random soft color
    'challenge': 'soft_random',          // Random soft color
    'duplicate': 'soft_random',          // Random soft color
    'reverse': 'soft_random',            // Random soft color
    'swap': 'soft_random'                // Random soft color
};

// Wheel configuration constants
const WHEEL_CONFIG = {
    CANVAS_SIZE: 600,
    MIN_RADIUS: 20,
    TEXT_RADIUS_RATIO: 0.7,
    CENTER_CIRCLE_RADIUS: 15,
    BORDER_WIDTH: 2,
    CENTER_BORDER_WIDTH: 3,
    SPIN_DURATION: 4000, // Increased to 4 seconds for more natural feel
    FULL_ROTATIONS: 8,
    ANGLE_RANDOMNESS: 15,
    // Water wheel styling
    WOODEN_RING_WIDTH: 25,
    WOODEN_SLAT_WIDTH: 8,
    WOODEN_RING_COLOR: '#8B4513', // Saddle brown
    WOODEN_SLAT_COLOR: '#A0522D', // Sienna
    TEXT_SIZE: 20, // Bigger text
    TEXT_WEIGHT: 'bold',
    // Variable spin force
    MIN_SPIN_FORCE: 3,  // Minimum full rotations
    MAX_SPIN_FORCE: 8,  // Reduced from 12 to 8 for more controlled spins
    EXTRA_ROTATION_RANGE: 0.5 // Additional rotation beyond full rotations (0.5 = half a segment)
};

// Function to get a random soft color
function getRandomSoftColor() {
    return SOFT_COLORS[Math.floor(Math.random() * SOFT_COLORS.length)];
}

// Export for browser environment
window.WheelConfig = {
    DEFAULT_WHEEL_SEGMENTS,
    ACTION_COLORS,
    WHEEL_CONFIG,
    SOFT_COLORS,
    getRandomSoftColor
};
