/**
 * Basic useWheel Hook Tests
 * Tests for React wheel hook functionality
 */

import { renderHook, act } from '@testing-library/react';
import { useWheel } from '../useWheel';

describe('useWheel Hook', () => {
	/**
	 * Tests hook initialization by calling wheelManager.getConfig() and verifying React state
	 * properly reflects WheelManager's segments array, canvas configuration, spin settings,
	 * and initial spinning/result states via useState and useCallback implementations.
	 */
	test('should initialize with wheel segments', () => {
		const { result } = renderHook(() => useWheel());
		
		// expect(result.current.segments).toHaveLength(8);
		expect(result.current.segments[0]).toHaveProperty('id');
		expect(result.current.segments[0]).toHaveProperty('text');
		expect(result.current.segments[0]).toHaveProperty('action');
		expect(result.current.segments[0]).toHaveProperty('color');
		expect(result.current.canvasSize).toBe(600);
		expect(result.current.spinDuration).toBe(3000);
		expect(result.current.isSpinning).toBe(false);
		expect(result.current.lastResult).toBeNull();
	});

	/** 
	 * Validates spin state management through startSpin() and stopSpin() methods,
	 * testing wheelManager.startSpin() delegation, isSpinning state updates via setIsSpinning,
	 * lastResult clearing on new spins, and proper state cleanup via wheelManager.stopSpin().
	 */
	test('should handle spin start/stop', () => {
		const { result } = renderHook(() => useWheel());
		
		// Test starting a spin
		act(() => {
			const spinParams = result.current.startSpin();
			expect(spinParams).toHaveProperty('totalRotation');
			expect(spinParams).toHaveProperty('duration');
			expect(typeof spinParams.totalRotation).toBe('number');
			expect(typeof spinParams.duration).toBe('number');
		});
		
		expect(result.current.isSpinning).toBe(true);
		expect(result.current.lastResult).toBeNull(); // Should clear on new spin
		
		// Test stopping a spin
		act(() => {
			result.current.stopSpin();
		});
		
		expect(result.current.isSpinning).toBe(false);
	});

	/** 
	 * Tests calculateWinnerAtPosition() wrapper by calling wheelManager.calculateWinnerAtPosition(),
	 * verifying SpinResult return structure, and confirming lastResult state update
	 * via setLastResult for component consumption.
	 */
	test('should calculate winner position', () => {
		const { result } = renderHook(() => useWheel());
		
		act(() => {
			const winnerResult = result.current.calculateWinnerAtPosition(0, false);
			expect(winnerResult).toHaveProperty('segment');
			expect(winnerResult).toHaveProperty('finalAngle');
			expect(winnerResult).toHaveProperty('winnerText');
		});
		
		expect(result.current.lastResult).not.toBeNull();
		expect(result.current.lastResult).toHaveProperty('segment');
		expect(result.current.lastResult).toHaveProperty('winnerText');
	});

	/** 
	 * Validates randomization methods by testing wheelManager.randomizeColors() and
	 * wheelManager.randomizeSegments() calls, then verifying refreshConfig() updates
	 * React state via setConfig() to reflect wheelManager configuration changes.
	 */
	test('should randomize wheel configuration', () => {
		const { result } = renderHook(() => useWheel());
		
		const originalSegments = [...result.current.segments];
		const originalColors = originalSegments.map(s => s.color);
		
		// Test color randomization
		act(() => {
			result.current.randomizeColors();
		});
		
		const newColors = result.current.segments.map(s => s.color);
		expect(newColors).not.toEqual(originalColors);
		
		// Test segment randomization
		const originalOrder = result.current.segments.map(s => s.id);
		
		act(() => {
			result.current.randomizeSegments();
		});
		
		const newOrder = result.current.segments.map(s => s.id);
		expect(result.current.segments).toHaveLength(originalSegments.length);
		expect(originalOrder.sort()).toEqual(newOrder.sort()); // Same IDs
		
		// Verify segments have valid properties after randomization
		result.current.segments.forEach(segment => {
			expect(segment.color).toBeDefined();
			expect(typeof segment.angle).toBe('number');
		});
	});
});
