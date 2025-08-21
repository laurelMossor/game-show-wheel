/**
 * Game State React Hook
 * Provides React integration for game state management
 */

import { useState, useEffect, useCallback } from 'react';
import { Player, GameState, ScoreUpdate } from '@/types/game';
import { gameState } from '@/lib/gameState';

export function useGameState() {
  const [state, setState] = useState<GameState>(gameState.getState());
  
  // Sync with localStorage changes
  useEffect(() => {
    const syncState = () => {
      setState(gameState.getState());
    };

    // Listen for storage changes (if multiple tabs)
    window.addEventListener('storage', syncState);
    
    return () => {
      window.removeEventListener('storage', syncState);
    };
  }, []);

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
  }, [state.players]);

  const getScoreSummary = useCallback(() => {
    return gameState.getScoreSummary();
  }, [state.players]);

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
