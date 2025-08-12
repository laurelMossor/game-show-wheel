"""
Wheel Logic Management
Handles spinning wheel mechanics, segments, and results
"""

import random
import math
from typing import Dict, List, Tuple, Optional

# Default wheel segments configuration
DEFAULT_SEGMENTS = [
    {"id": 0, "text": "New Rule", "action": "new_rule", "angle": 0},
    {"id": 1, "text": "New Rule", "action": "new_rule", "angle": 30},
    {"id": 2, "text": "New Rule", "action": "new_rule", "angle": 60},
    {"id": 3, "text": "Modify: Audience Choice", "action": "audience_choice", "angle": 90},
    {"id": 4, "text": "Modify: Audience Choice", "action": "audience_choice", "angle": 120},
    {"id": 5, "text": "Challenge", "action": "challenge", "angle": 150},
    {"id": 6, "text": "Challenge", "action": "challenge", "angle": 180},
    {"id": 7, "text": "Challenge", "action": "challenge", "angle": 210},
    {"id": 8, "text": "Modify: Duplicate", "action": "duplicate", "angle": 240},
    {"id": 9, "text": "Modify: Reverse", "action": "reverse", "angle": 270},
    {"id": 10, "text": "Modify: Swap", "action": "swap", "angle": 300}
]

# Configuration constants
MAX_SEGMENTS = 12
DEFAULT_SPIN_DURATION = 3000
DEFAULT_MIN_SPINS = 3
ANGLE_RANDOMNESS = 15

class WheelLogic:
    def __init__(self):
        # Game show wheel segments with special actions - no styling concerns
        self.segments = DEFAULT_SEGMENTS.copy()
        
        self.current_segment = None
        self.is_spinning = False
        self.spin_duration = DEFAULT_SPIN_DURATION
        self.min_spins = DEFAULT_MIN_SPINS
        
        # Initialize angles properly
        self._recalculate_angles()
        
    def get_segments(self) -> List[Dict]:
        """Get all wheel segments"""
        return self.segments.copy()
    
    def get_current_segment(self) -> Optional[Dict]:
        """Get the currently selected segment"""
        return self.current_segment
    
    def add_segment(self, text: str, action: str) -> bool:
        """Add a new segment to the wheel"""
        if len(self.segments) >= MAX_SEGMENTS:
            return False
        
        new_id = max(segment["id"] for segment in self.segments) + 1
        angle = (360 / (len(self.segments) + 1)) * len(self.segments)
        
        new_segment = {
            "id": new_id,
            "text": text,
            "action": action,
            "angle": angle
        }
        
        self.segments.append(new_segment)
        self._recalculate_angles()
        return True
    
    def remove_segment(self, segment_id: int) -> bool:
        """Remove a segment from the wheel"""
        for i, segment in enumerate(self.segments):
            if segment["id"] == segment_id:
                del self.segments[i]
                self._recalculate_angles()
                return True
        return False
    
    def spin(self) -> Dict:
        """Spin the wheel and return the result"""
        if self.is_spinning:
            return {"error": "Wheel is already spinning"}
        
        self.is_spinning = True
        
        try:
            # Select random segment
            selected_segment = random.choice(self.segments)
            self.current_segment = selected_segment
            
            # Calculate final rotation angle
            final_angle = self._calculate_final_angle(selected_segment)
            
            # Simulate spin result
            result = {
                "segment": selected_segment,
                "final_angle": final_angle,
                "duration": self.spin_duration,
                "min_spins": self.min_spins
            }
            
            return result
        finally:
            self.is_spinning = False
    
    def _calculate_final_angle(self, segment: Dict) -> float:
        """Calculate the final rotation angle for a segment"""
        # Add some randomness to make it feel more natural
        base_angle = segment["angle"]
        random_offset = random.uniform(-ANGLE_RANDOMNESS, ANGLE_RANDOMNESS)
        final_angle = base_angle + random_offset
        
        # Ensure angle is between 0 and 360
        final_angle = final_angle % 360
        return final_angle
    
    def _recalculate_angles(self) -> None:
        """Recalculate angles for all segments after adding/removing"""
        segment_count = len(self.segments)
        if segment_count == 0:
            return
        
        angle_step = 360 / segment_count
        for i, segment in enumerate(self.segments):
            segment["angle"] = i * angle_step
    
    def set_spin_duration(self, duration: int) -> None:
        """Set the spin duration in milliseconds"""
        self.spin_duration = max(1000, min(10000, duration))  # Between 1-10 seconds
    
    def set_min_spins(self, spins: int) -> None:
        """Set the minimum number of full rotations"""
        self.min_spins = max(1, min(10, spins))  # Between 1-10 spins
    
    def get_wheel_stats(self) -> Dict:
        """Get wheel statistics"""
        return {
            "total_segments": len(self.segments),
            "actions": list(set(segment["action"] for segment in self.segments)),
            "spin_duration": self.spin_duration,
            "min_spins": self.min_spins
        }
    
    def reset_to_defaults(self) -> None:
        """Reset wheel to default segments"""
        self.segments = DEFAULT_SEGMENTS.copy()
        self._recalculate_angles()
        self.current_segment = None
