import { describe, expect, it } from 'vitest';
import { testDb } from './test-db.ts';
import {
	addRun,
	bests,
	deleteRun,
	getRun,
	knownRoutes,
	listRuns,
	monthlyTotals,
	parseRunForm,
	updateRun,
	type RunInput
} from './runs.ts';

const base: RunInput = {
	day: '2026-10-01',
	route: 'Rainbow Valley',
	metres: 3650,
	seconds: 23 * 60 + 10,
	climb: 89,
	surface: 'Technical'
};

function form(values: Record<string, string>) {
	const f = new FormData();
	for (const [k, v] of Object.entries(values)) f.set(k, v);
	return f;
}

describe('runs', () => {
	it('adds, scores, edits and deletes', async () => {
		const db = await testDb();
		const id = await addRun(db, base);
		const r = await getRun(db, id);
		expect(r?.grade).toBe('C');
		expect(r?.score).toBeCloseTo(18.4737, 3);

		await updateRun(db, id, { ...base, seconds: 21 * 60 + 49 });
		expect((await getRun(db, id))?.grade).toBe('B');

		await deleteRun(db, id);
		expect(await getRun(db, id)).toBeNull();
	});

	it('lists newest first', async () => {
		const db = await testDb();
		await addRun(db, base);
		await addRun(db, { ...base, day: '2026-10-05', route: 'Later' });
		await addRun(db, { ...base, day: '2026-09-20', route: 'Earlier' });
		expect((await listRuns(db)).map((r) => r.route)).toEqual([
			'Later',
			'Rainbow Valley',
			'Earlier'
		]);
	});
});

describe('parseRunForm', () => {
	const good = {
		day: '2026-10-01',
		route: ' Rainbow Valley ',
		km: '3.65',
		time: '23:10',
		climb: '89',
		surface: 'Technical'
	};

	it('reads a run', () => {
		expect(parseRunForm(form(good))).toEqual({
			ok: true,
			run: { ...base, route: 'Rainbow Valley' }
		});
	});

	it('lets climb be left blank', () => {
		const result = parseRunForm(form({ ...good, climb: '' }));
		expect(result.ok && result.run.climb).toBe(0);
	});

	it('says what’s wrong and keeps what was typed', () => {
		const result = parseRunForm(form({ ...good, time: '23:99' }));
		expect(result).toMatchObject({ ok: false, values: { time: '23:99', route: 'Rainbow Valley' } });
		expect(parseRunForm(form({ ...good, surface: 'Lava' })).ok).toBe(false);
		expect(parseRunForm(form({ ...good, day: '2026-13-01' })).ok).toBe(false);
		expect(parseRunForm(form({ ...good, climb: '1.5' })).ok).toBe(false);
	});
});

describe('summaries', () => {
	const runs = [
		{
			...base,
			id: 3,
			createdAt: '',
			day: '2026-10-05',
			route: 'Valley',
			metres: 8300,
			climb: 119,
			surface: 'Mixed' as const
		},
		{ ...base, id: 2, createdAt: '' },
		{ ...base, id: 1, createdAt: '', day: '2026-09-20', route: 'Valley', metres: 8000, climb: 100 }
	];

	it('remembers routes with their latest details, most-run first', () => {
		expect(knownRoutes(runs)).toEqual([
			{ route: 'Valley', km: '8.30', climb: 119, surface: 'Mixed', count: 2 },
			{ route: 'Rainbow Valley', km: '3.65', climb: 89, surface: 'Technical', count: 1 }
		]);
	});

	it('totals each month', () => {
		expect(monthlyTotals(runs)).toEqual([
			{ month: '2026-10', metres: 11950, climb: 208, runs: 2 },
			{ month: '2026-09', metres: 8000, climb: 100, runs: 1 }
		]);
	});

	it('finds bests', async () => {
		const db = await testDb();
		await addRun(db, base);
		await addRun(db, { ...base, metres: 2000, seconds: 480, route: 'Sprint' });
		await addRun(db, { ...base, metres: 10000, seconds: 3600, climb: 300, route: 'Long' });
		const b = bests(await listRuns(db));
		expect(b.score?.route).toBe('Sprint');
		// Under 3 km doesn't count for pace.
		expect(b.pace?.route).toBe('Long');
		expect(b.distance?.route).toBe('Long');
		expect(b.climb?.route).toBe('Long');
	});
});
