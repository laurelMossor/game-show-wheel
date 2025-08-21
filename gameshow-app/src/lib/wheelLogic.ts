/**
 * Wheel Logic Management
 * Handles spinning wheel mechanics, segments, and results
 */

import { WheelSegment, SpinResult, WheelConfig } from '@/types/game';

// Default wheel segments configuration from V1
// is this a duplicate of the segments in the V2 wheel?
const DEFAULT_SEGMENTS: Omit<WheelSegment, 'color'>[] = [
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

// Soft color palette for wheel segments
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
   * Spin the wheel and return result
   */
  async spin(): Promise<SpinResult> {
    if (this.isSpinning) {
      throw new Error('Wheel is already spinning');
    }

    this.isSpinning = true;

    try {
      // Select random segment
      const selectedSegment = this.config.segments[
        Math.floor(Math.random() * this.config.segments.length)
      ];

      // Calculate spin parameters
      const baseRotations = 5; // Always spin about 5 full rotations
      const extraRotations = Math.random() * 2; // Add 0-2 extra rotations
      const totalRotations = (baseRotations + extraRotations) * 360;

      // Calculate final angle with some randomness within the segment
      const segmentAngle = 360 / this.config.segments.length;
      const offset = (Math.random() * 0.5 + 0.25) * segmentAngle;
      const finalAngle = selectedSegment.angle + offset;

      const result: SpinResult = {
        segment: selectedSegment,
        finalAngle: (totalRotations + finalAngle) % 360,
        duration: this.config.spinDuration,
        winnerText: selectedSegment.text.toUpperCase()
      };

      // Simulate async spinning duration
      await new Promise(resolve => setTimeout(resolve, this.config.spinDuration));

      return result;
    } finally {
      this.isSpinning = false;
    }
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
    
    // The pointer points to the right (3 o'clock position = 0 degrees)
    // We need to find which segment is at that position
    const adjustedRotation = (360 - normalizedRotation) % 360;
    const segmentIndex = Math.floor(adjustedRotation / segmentAngle) % this.config.segments.length;
    
    return this.config.segments[segmentIndex] || null;
  }
}

// Export singleton instance
export const wheelManager = new WheelManager();
