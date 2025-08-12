"""
Wheel Logic Management
Handles spinning wheel mechanics, segments, and results
"""

import random
import math
from typing import Dict, List, Tuple, Optional

class WheelLogic:
    def __init__(self):
        # Game show wheel segments with special actions
        self.segments = [
            {"id": 0, "text": "New Rule", "action": "new_rule", "color": "#FF6B6B", "angle": 0},
            {"id": 1, "text": "New Rule", "action": "new_rule", "color": "#4ECDC4", "angle": 30},
            {"id": 2, "text": "New Rule", "action": "new_rule", "color": "#45B7D1", "angle": 60},
            {"id": 3, "text": "Modify: Audience Choice", "action": "audience_choice", "color": "#96CEB4", "angle": 90},
            {"id": 4, "text": "Modify: Audience Choice", "action": "audience_choice", "color": "#FFEAA7", "angle": 120},
            {"id": 5, "text": "Challenge", "action": "challenge", "color": "#DDA0DD", "angle": 150},
            {"id": 6, "text": "Challenge", "action": "challenge", "color": "#98D8C8", "angle": 180},
            {"id": 7, "text": "Challenge", "action": "challenge", "color": "#F7DC6F", "angle": 210},
            {"id": 8, "text": "Modify: Duplicate", "action": "duplicate", "color": "#FF9F43", "angle": 240},
            {"id": 9, "text": "Modify: Reverse", "action": "reverse", "color": "#A29BFE", "angle": 270},
            {"id": 10, "text": "Modify: Swap", "action": "swap", "color": "#FD79A8", "angle": 300}
        ]
        
        self.current_segment = None
        self.is_spinning = False
        self.spin_duration = 3000  # milliseconds
        self.min_spins = 3  # minimum number of full rotations
        
        # Initialize angles properly
        self._recalculate_angles()
        
    def get_segments(self) -> List[Dict]:
        """Get all wheel segments"""
        return self.segments.copy()
    
    def get_current_segment(self) -> Optional[Dict]:
        """Get the currently selected segment"""
        return self.current_segment
    
    def add_segment(self, text: str, action: str, color: str) -> bool:
        """Add a new segment to the wheel"""
        if len(self.segments) >= 12:  # Limit to 12 segments
            return False
        
        new_id = max(segment["id"] for segment in self.segments) + 1
        angle = (360 / (len(self.segments) + 1)) * len(self.segments)
        
        new_segment = {
            "id": new_id,
            "text": text,
            "action": action,
            "color": color,
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
        
        self.is_spinning = False
        return result
    
    def _calculate_final_angle(self, segment: Dict) -> float:
        """Calculate the final rotation angle for a segment"""
        # Add some randomness to make it feel more natural
        base_angle = segment["angle"]
        random_offset = random.uniform(-15, 15)  # ±15 degrees randomness
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
