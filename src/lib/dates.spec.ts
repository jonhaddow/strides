import { describe, expect, it } from 'vitest';
import { formatDay, formatMonth, isDay, todayHere } from './dates.ts';

describe('dates', () => {
	it('formats days and months', () => {
		expect(formatDay('2026-10-16')).toBe('Fri 16 Oct');
		expect(formatMonth('2026-10')).toBe('October 2026');
	});

	it('checks days', () => {
		expect(isDay('2026-02-28')).toBe(true);
		expect(isDay('2026-02-30')).toBe(false);
		expect(isDay('26-2-1')).toBe(false);
	});

	it('gives the device’s date', () => {
		expect(todayHere(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
	});
});
