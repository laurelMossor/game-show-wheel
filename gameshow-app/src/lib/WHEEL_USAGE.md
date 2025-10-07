# Extensible Wheel Configuration System

## Overview
The wheel system now uses a single, extensible function that automatically calculates angles based on the number of segments you provide. No need for separate functions for different segment counts!

## Basic Usage

### Single Function for Any Configuration

```typescript
import { wheelManager } from '@/lib/wheelLogic';

// Create a wheel with any number of segments
wheelManager.setWheelSegments([
  { text: "Action 1", action: "new_rule" },
  { text: "Action 2", action: "audience_choice" },
  { text: "Action 3", action: "challenge" }
]);
// Automatically creates 3 segments at 0°, 120°, and 240°

wheelManager.setWheelSegments([
  { text: "Option A", action: "swap" },
  { text: "Option B", action: "destroy_rule_self" },
  { text: "Option C", action: "new_rule_other" },
  { text: "Option D", action: "opposite_rule" },
  { text: "Option E", action: "shift_1_right" }
]);
// Automatically creates 5 segments at 0°, 72°, 144°, 216°, and 288°
```

## Predefined Configurations

Use the exported configurations from `wheelConfigurations.ts` for common setups:

```typescript
import { wheelManager } from '@/lib/wheelLogic';
import { 
  WHEEL_CONFIG_4_SEGMENTS,
  WHEEL_CONFIG_6_SEGMENTS, 
  WHEEL_CONFIG_8_SEGMENTS,
  WHEEL_CONFIG_12_SEGMENTS,
  WHEEL_CONFIG_ORIGINAL 
} from '@/lib/wheelConfigurations';

// Use predefined 6-segment config
wheelManager.setWheelSegments(WHEEL_CONFIG_6_SEGMENTS);

// Use predefined 8-segment config
wheelManager.setWheelSegments(WHEEL_CONFIG_8_SEGMENTS);

// Use predefined 12-segment config
wheelManager.setWheelSegments(WHEEL_CONFIG_12_SEGMENTS);

// Use original V1 configuration (11 segments)
wheelManager.setWheelSegments(WHEEL_CONFIG_ORIGINAL);
```

### Available Configurations

All wheel configurations are defined in `wheelConfigurations.ts`:

- **`WHEEL_CONFIG_4_SEGMENTS`** - Simple 4-option wheel (difficulty-based)
- **`WHEEL_CONFIG_6_SEGMENTS`** - Default 6-option wheel (rule modifications) 
- **`WHEEL_CONFIG_8_SEGMENTS`** - Extended 8-option wheel (adds new rule options)
- **`WHEEL_CONFIG_12_SEGMENTS`** - Comprehensive 12-option wheel (all actions)
- **`WHEEL_CONFIG_ORIGINAL`** - Original V1 wheel (11 segments, preserved for compatibility)

You can also use helper functions:

```typescript
import { getWheelConfig, getAvailableConfigs } from '@/lib/wheelConfigurations';

// Get a configuration by name
const config = getWheelConfig('8-segment');
wheelManager.setWheelSegments(config);

// Get all available configuration names
const availableConfigs = getAvailableConfigs();
console.log(availableConfigs); // ['4-segment', '6-segment', '8-segment', '12-segment', 'original']
```

## Custom Start Angle

You can optionally specify a starting angle:

```typescript
wheelManager.setWheelSegments([
  { text: "North", action: "new_rule" },
  { text: "East", action: "audience_choice" },
  { text: "South", action: "challenge" },
  { text: "West", action: "duplicate" }
], 45); // Start at 45° instead of 0°
```

## Custom IDs

You can optionally provide custom IDs for segments:

```typescript
wheelManager.setWheelSegments([
  { id: 100, text: "High Priority", action: "new_rule" },
  { id: 200, text: "Medium Priority", action: "audience_choice" },
  { text: "Low Priority", action: "challenge" } // ID auto-assigned as 2
]);
```

## Creating Your Own Configurations

```typescript
import { GameAction } from '@/types/game';

// Define your custom configuration
const MY_CUSTOM_WHEEL: Array<{ text: string; action: GameAction }> = [
  { text: "Easy", action: "new_rule" },
  { text: "Medium", action: "audience_choice" },
  { text: "Hard", action: "challenge" },
  { text: "Expert", action: "destroy_rule_self" },
  { text: "Master", action: "opposite_rule" }
];

// Use it with the single extensible function
wheelManager.setWheelSegments(MY_CUSTOM_WHEEL);
```

## Angle Calculation

The system automatically calculates angles:
- **Formula**: `angle = startAngle + (index * (360 / segmentCount))`
- **3 segments**: 0°, 120°, 240°
- **4 segments**: 0°, 90°, 180°, 270°
- **5 segments**: 0°, 72°, 144°, 216°, 288°
- **6 segments**: 0°, 60°, 120°, 180°, 240°, 300°
- **8 segments**: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
- **12 segments**: 0°, 30°, 60°, 90°, 120°, 150°, 180°, 210°, 240°, 270°, 300°, 330°

## Benefits

✅ **One Function**: Single `setWheelSegments()` function for all use cases  
✅ **Auto-Calculation**: Angles calculated automatically based on segment count  
✅ **Type-Safe**: Uses `GameAction` type for compile-time safety  
✅ **Flexible**: Works with any number of segments (2, 3, 4, 5, 10, 100, etc.)  
✅ **Clean**: No hardcoded functions for specific segment counts  
✅ **Extensible**: Easy to create and use custom configurations

