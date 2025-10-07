/**
* Game Show Application Types
* Centralized type definitions for the game show app
*/

export type GameAction = 
	| 'new_rule'
	| 'audience_choice'
	| 'challenge'
	| 'duplicate'
	| 'reverse'
	| 'swap'
	| 'destroy_rule_self'
	| 'shift_1_right'
	| 'opposite_rule'
	| 'destroy_rule_other'
	| 'new_rule_self'
	| 'new_rule_other';

export interface Player {
	id: string;
	name: string;
	score: number;
}

export interface WheelSegment {
	id: number;
	text: string;
	action: GameAction;
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

export interface ScoreUpdate {
	playerId: string;
	points: number;
	reason?: string;
}
