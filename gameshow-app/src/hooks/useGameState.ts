/**
* Game State React Hook
* Provides React integration for game state management
*/

import { useState, useEffect, useCallback } from 'react';
import { GameState, ScoreUpdate } from '@/types/game';
import { gameState } from '@/lib/gameState';

export function useGameState() {
	const [state, setState] = useState<GameState>(() => {
		// Initialize with default state to prevent hydration mismatch
		return {
			players: [
				{ id: 'player1', name: 'Player 1', score: 0 },
				{ id: 'player2', name: 'Player 2', score: 0 },
				{ id: 'player3', name: 'Player 3', score: 0 },
			],
			// HEY where did rounds come from? 
			currentRound: 1,
			gameStarted: false,
		};
	});
	const [mounted, setMounted] = useState(false);

	// Load actual state after hydration to prevent mismatch
	useEffect(() => {
		setMounted(true);
		setState(gameState.getState());
	}, []);

	// Sync with localStorage changes
	useEffect(() => {
		if (!mounted) return;

		const syncState = () => {
			setState(gameState.getState());
		};

		// Listen for storage changes (if multiple tabs)
		window.addEventListener('storage', syncState);

		return () => {
			window.removeEventListener('storage', syncState);
		};
	}, [mounted]);

	const updateScore = useCallback((update: ScoreUpdate) => {
		const success = gameState.updateScore(update);
		if (success) {
			setState(gameState.getState());
		}
		return success;
	}, []);

	const setScore = useCallback((playerId: string, score: number) => {
		const success = gameState.setScore(playerId, score);
		if (success) {
			setState(gameState.getState());
		}
		return success;
	}, []);

	const updatePlayerName = useCallback((playerId: string, name: string) => {
		const success = gameState.updatePlayerName(playerId, name);
		if (success) {
			setState(gameState.getState());
		}
		return success;
	}, []);

	const resetScores = useCallback(() => {
		gameState.resetScores();
		setState(gameState.getState());
	}, []);

	const resetGame = useCallback(() => {
		gameState.resetGame();
		setState(gameState.getState());
	}, []);

	const startGame = useCallback(() => {
		gameState.startGame();
		setState(gameState.getState());
	}, []);

	const getWinner = useCallback(() => {
		return gameState.getWinner();
	}, []);

	const getScoreSummary = useCallback(() => {
		return gameState.getScoreSummary();
	}, []);

	return {
		// State
		players: state.players,
		currentRound: state.currentRound,
		gameStarted: state.gameStarted,
		lastWheelResult: state.lastWheelResult,

		// Actions
		updateScore,
		setScore,
		updatePlayerName,
		resetScores,
		resetGame,
		startGame,

		// Computed values
		getWinner,
		getScoreSummary,
	};
}
