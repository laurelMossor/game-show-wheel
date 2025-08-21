"""
Game State Management
Handles player scores, game state, and score persistence
"""

import json
import os
from typing import Dict, List, Optional

class GameState:
    def __init__(self, save_file: str = "game_scores.json"):
        self.save_file = save_file
        self.players = ["Player 1", "Player 2", "Player 3"]
        self.scores = {player: 0 for player in self.players}
        self.load_scores()
    
    def get_players(self) -> List[str]:
        """Get list of player names"""
        return self.players
    
    def get_scores(self) -> Dict[str, int]:
        """Get current scores for all players"""
        return self.scores.copy()
    
    def get_player_score(self, player_id: int) -> int:
        """Get score for a specific player by ID (0, 1, 2)"""
        if 0 <= player_id < len(self.players):
            return self.scores[self.players[player_id]]
        return 0
    
    def update_score(self, player_id: int, points: int) -> bool:
        """Update score for a specific player by ID"""
        if 0 <= player_id < len(self.players):
            self.scores[self.players[player_id]] += points
            self.save_scores()
            return True
        return False
    
    def set_score(self, player_id: int, score: int) -> bool:
        """Set absolute score for a specific player"""
        if 0 <= player_id < len(self.players):
            self.scores[self.players[player_id]] = score
            self.save_scores()
            return True
        return False
    
    def reset_scores(self) -> None:
        """Reset all scores to zero"""
        self.scores = {player: 0 for player in self.players}
        self.save_scores()
    
    def save_scores(self) -> None:
        """Save current scores to file"""
        try:
            with open(self.save_file, 'w') as f:
                json.dump(self.scores, f, indent=2)
        except Exception as e:
            print(f"Error saving scores: {e}")
    
    def load_scores(self) -> None:
        """Load scores from file if it exists"""
        try:
            if os.path.exists(self.save_file):
                with open(self.save_file, 'r') as f:
                    loaded_scores = json.load(f)
                    # Only load scores for existing players
                    for player in self.players:
                        if player in loaded_scores:
                            self.scores[player] = loaded_scores[player]
        except Exception as e:
            print(f"Error loading scores: {e}")
    
    def get_winner(self) -> Optional[str]:
        """Get the player with the highest score"""
        if not self.scores:
            return None
        
        max_score = max(self.scores.values())
        winners = [player for player, score in self.scores.items() if score == max_score]
        
        if len(winners) == 1:
            return winners[0]
        elif len(winners) > 1:
            return "Tie"
        return None
