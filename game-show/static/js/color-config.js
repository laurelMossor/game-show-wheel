/**
 * Medieval Fantasy Color Configuration
 * Shared color palette for consistent theming across CSS and JavaScript
 */

// Medieval Fantasy Color Palette
const MEDIEVAL_COLORS = {
    // Primary Colors
    primary: '#8B4513',      // Saddle Brown
    secondary: '#556B2F',    // Dark Olive Green
    accent: '#DC143C',       // Crimson
    
    // Success & Warning
    success: '#6B8E23',      // Olive Drab
    warning: '#DAA520',      // Goldenrod
    info: '#4682B4',         // Steel Blue
    
    // Neutral Colors
    light: '#F5F5DC',        // Beige
    dark: '#2F4F4F',         // Dark Slate Gray
    gold: '#FFD700',         // Gold
    silver: '#C0C0C0',       // Silver
    bronze: '#CD7F32',       // Bronze
    
    // Additional Medieval Colors
    tan: '#D2B48C',          // Tan
    cream: '#FFF8DC',        // Cornsilk
    forestGreen: '#228B22',  // Forest Green
    sageGreen: '#9CAF88',    // Sage
    deepBrown: '#654321',    // Dark Brown
    warmYellow: '#F0E68C',   // Khaki
    mutedGreen: '#8FBC8F',   // Dark Sea Green
};

// Wheel-specific color mapping
const WHEEL_COLORS = [
    MEDIEVAL_COLORS.accent,      // Crimson
    MEDIEVAL_COLORS.forestGreen, // Forest Green
    MEDIEVAL_COLORS.sageGreen,   // Sage Green
    MEDIEVAL_COLORS.mutedGreen,  // Muted Green
    MEDIEVAL_COLORS.warmYellow,  // Warm Yellow
    MEDIEVAL_COLORS.tan,         // Tan
    MEDIEVAL_COLORS.deepBrown,   // Deep Brown
    MEDIEVAL_COLORS.warning,     // Goldenrod
    MEDIEVAL_COLORS.primary,     // Saddle Brown
    MEDIEVAL_COLORS.secondary,   // Dark Olive Green
    MEDIEVAL_COLORS.info         // Steel Blue
];

// Function to get CSS variable value with fallback to our color config
function getThemeColor(colorName, fallbackColor = null) {
    // Try to get from CSS variable first
    const cssValue = getComputedStyle(document.documentElement).getPropertyValue(`--${colorName}`).trim();
    
    if (cssValue && cssValue !== '') {
        return cssValue;
    }
    
    // Fallback to our color config
    if (fallbackColor) {
        return fallbackColor;
    }
    
    // Try to find in MEDIEVAL_COLORS
    const key = colorName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return MEDIEVAL_COLORS[key] || '#000000';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MEDIEVAL_COLORS, WHEEL_COLORS, getThemeColor };
} else {
    // Browser environment
    window.MEDIEVAL_COLORS = MEDIEVAL_COLORS;
    window.WHEEL_COLORS = WHEEL_COLORS;
    window.getThemeColor = getThemeColor;
}
