/**
* Game State Management
* Handles player scores, game state, and persistence using localStorage
*/

import { Player, GameState, ScoreUpdate } from '@/types/game';

const STORAGE_KEY = 'gameshow-state';
const DEFAULT_PLAYERS: Player[] = [
    { id: 'player1', name: 'Player 1', score: 0 },
    { id: 'player2', name: 'Player 2', score: 0 },
    { id: 'player3', name: 'Player 3', score: 0 },
];

export class GameStateManager {
    private state: GameState;

    constructor() {
        this.state = this.loadFromStorage();
    }

    /**
    * Get current game state
    */
    getState(): GameState {
        return { ...this.state };
    }

    /**
    * Get all players
    */
    getPlayers(): Player[] {
        return [...this.state.players];
    }

    /**
    * Get player by ID
    */
    getPlayer(playerId: string): Player | undefined {
        return this.state.players.find(p => p.id === playerId);
    }

    /**
    * Update player name
    */
    updatePlayerName(playerId: string, name: string): boolean {
        const player = this.state.players.find(p => p.id === playerId);
        if (player) {
            player.name = name;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
    * Update player score
    */
    updateScore(update: ScoreUpdate): boolean {
        const player = this.state.players.find(p => p.id === update.playerId);
        if (player) {
            player.score += update.points;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
    * Set absolute score for a player
    */
    setScore(playerId: string, score: number): boolean {
        const player = this.state.players.find(p => p.id === playerId);
        if (player) {
            player.score = score;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
    * Reset all scores to zero
    */
    resetScores(): void {
        this.state.players.forEach(player => {
            player.score = 0;
        });
        this.saveToStorage();
    }

    /**
    * Reset entire game state
    */
    resetGame(): void {
        this.state = {
            players: DEFAULT_PLAYERS.map(p => ({ ...p })),
            currentRound: 1,
            gameStarted: false,
        };
        this.saveToStorage();
    }

    /**
    * Start the game
    */
    startGame(): void {
        this.state.gameStarted = true;
        this.saveToStorage();
    }

    /**
    * Get the winner (player with highest score)
    */
    getWinner(): Player | 'tie' | null {
        if (!this.state.players.length) return null;

        const maxScore = Math.max(...this.state.players.map(p => p.score));
        const winners = this.state.players.filter(p => p.score === maxScore);

        if (winners.length === 1) {
            return winners[0];
        } else if (winners.length > 1 && maxScore > 0) {
            return 'tie';
        }
        return null;
    }

    /**
    * Get scores summary
    */
    getScoreSummary(): Record<string, number> {
        return this.state.players.reduce((acc, player) => {
            acc[player.name] = player.score;
            return acc;
        }, {} as Record<string, number>);
    }

    /**
    * Save state to localStorage
    */
    private saveToStorage(): void {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            }
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }

    /**
    * Load state from localStorage
    */
    private loadFromStorage(): GameState {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Validate the loaded state
                    if (this.isValidGameState(parsed)) {
                        return parsed;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }

        // Return default state
        return {
            players: DEFAULT_PLAYERS.map(p => ({ ...p })),
            currentRound: 1,
            gameStarted: false,
        };
    }

    /**
    * Validate game state structure
    */
    private isValidGameState(state: any): state is GameState {
        return (
            state &&
            typeof state === 'object' &&
            Array.isArray(state.players) &&
            state.players.length === 3 &&
            state.players.every((p: any) => 
                p && typeof p.id === 'string' && 
                typeof p.name === 'string' && 
                typeof p.score === 'number'
            ) &&
            typeof state.currentRound === 'number' &&
            typeof state.gameStarted === 'boolean'
        );
    }
}

// Export singleton instance
export const gameState = new GameStateManager();
