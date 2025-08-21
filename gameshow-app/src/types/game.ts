/**
* Game Show Application Types
* Centralized type definitions for the game show app
*/

export interface Player {
    id: string;
    name: string;
    score: number;
}

export interface WheelSegment {
    id: number;
    text: string;
    action: string;
    color: string;
    angle: number;
}

export interface SpinResult {
    segment: WheelSegment;
    finalAngle: number;
    duration: number;
    winnerText: string;
}

export interface GameState {
    players: Player[];
    currentRound: number;
    gameStarted: boolean;
    lastWheelResult?: SpinResult;
}

export interface WheelConfig {
    segments: WheelSegment[];
    canvasSize: number;
    spinDuration: number;
    minSpins: number;
    maxSpins: number;
}

export type GameAction = 
    | 'new_rule'
    | 'audience_choice'
    | 'challenge'
    | 'duplicate'
    | 'reverse'
    | 'swap';

export interface ScoreUpdate {
    playerId: string;
    points: number;
    reason?: string;
}
