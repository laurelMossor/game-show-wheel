/**
* Wheel React Hook
* Provides React integration for wheel management
*/

import { useState, useCallback } from 'react';
import { SpinResult, WheelConfig } from '@/types/game';
import { wheelManager } from '@/lib/wheelLogic';

export function useWheel() {
	const [config, setConfig] = useState<WheelConfig>(wheelManager.getConfig());
	const [isSpinning, setIsSpinning] = useState(false);
	const [lastResult, setLastResult] = useState<SpinResult | null>(null);

	// Sync config changes
	const refreshConfig = useCallback(() => {
		setConfig(wheelManager.getConfig());
		setIsSpinning(wheelManager.getIsSpinning());
	}, []);

	const spin = useCallback(async (): Promise<SpinResult> => {
		if (isSpinning) {
			throw new Error('Wheel is already spinning');
		}

		setIsSpinning(true);
		setLastResult(null);

		try {
			const result = await wheelManager.spin();
			setLastResult(result);
			return result;
		} catch (error) {
			console.error('Wheel spin failed:', error);
			throw error;
		} finally {
			setIsSpinning(false);
		}
	}, [isSpinning]);

	const randomizeColors = useCallback(() => {
		wheelManager.randomizeColors();
		refreshConfig();
	}, [refreshConfig]);

	const randomizeSegments = useCallback(() => {
		wheelManager.randomizeSegments();
		refreshConfig();
	}, [refreshConfig]);

	const setSpinDuration = useCallback((duration: number) => {
		wheelManager.setSpinDuration(duration);
		refreshConfig();
	}, [refreshConfig]);

	const resetToDefaults = useCallback(() => {
		wheelManager.resetToDefaults();
		refreshConfig();
		setLastResult(null);
	}, [refreshConfig]);

	const getSegmentAtAngle = useCallback((rotation: number) => {
		return wheelManager.getSegmentAtAngle(rotation);
	}, []);

	const getStats = useCallback(() => {
		return wheelManager.getStats();
	}, []);

	return {
		// State
		segments: config.segments,
		canvasSize: config.canvasSize,
		spinDuration: config.spinDuration,
		isSpinning,
		lastResult,

		// Actions
		spin,
		randomizeColors,
		randomizeSegments,
		setSpinDuration,
		resetToDefaults,

		// Utilities
		getSegmentAtAngle,
		getStats,
		refreshConfig,
	};
}
