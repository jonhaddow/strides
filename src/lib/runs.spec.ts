import { describe, expect, it } from 'vitest';
import { formatDuration, grade, pace, parseDuration, parseKm, score } from './runs.ts';

describe('score', () => {
	it('matches the old sheet', () => {
		// Kimberley SummerSling: 8.41 km, 50:59, 223 m, Mixed.
		expect(score(8410, 50 * 60 + 59, 223, 'Mixed')).toBeCloseTo(19.6714, 3);
		// Lombardy Res loop: 4.64 km, 21:32, 10 m, Road.
		expect(score(4640, 21 * 60 + 32, 10, 'Road')).toBeCloseTo(23.3987, 3);
		// Anti Crow Hut: 15.93 km, 155:35, 348 m, Technical.
		expect(score(15930, 155 * 60 + 35, 348, 'Technical')).toBeCloseTo(11.2556, 3);
	});

	it('is 0 without a distance or time', () => {
		expect(score(0, 100, 0, 'Road')).toBe(0);
		expect(score(1000, 0, 0, 'Road')).toBe(0);
	});
});

describe('grade', () => {
	it('uses the sheet’s bands', () => {
		expect(grade(25).label).toBe('A+');
		expect(grade(24.99).label).toBe('A');
		expect(grade(19.5).label).toBe('B');
		expect(grade(16.5).label).toBe('C');
		expect(grade(13.5).label).toBe('D');
		expect(grade(8.5).label).toBe('E');
	});
});

describe('durations', () => {
	it('reads minutes:seconds, hours and plain minutes', () => {
		expect(parseDuration('50:59')).toBe(3059);
		expect(parseDuration('155:35')).toBe(9335);
		expect(parseDuration('1:15:35')).toBe(4535);
		expect(parseDuration('51')).toBe(3060);
		// A typo from the sheet.
		expect(parseDuration('21.:32')).toBe(1292);
	});

	it('refuses what isn’t a time', () => {
		for (const bad of ['', '0', '12:75', 'abc', '1:2:3:4', '-5'])
			expect(parseDuration(bad)).toBeNull();
	});

	it('formats', () => {
		expect(formatDuration(3059)).toBe('50:59');
		expect(formatDuration(4535)).toBe('1:15:35');
		expect(formatDuration(pace(8410, 3059))).toBe('6:04');
	});
});

describe('parseKm', () => {
	it('reads km as metres', () => {
		expect(parseKm('8.41')).toBe(8410);
		expect(parseKm('3,5')).toBe(3500);
		expect(parseKm('0')).toBeNull();
		expect(parseKm('x')).toBeNull();
	});
});
