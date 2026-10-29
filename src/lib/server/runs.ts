import { desc, eq } from 'drizzle-orm';
import { isDay } from '../dates.ts';
import { SURFACES, grade, pace, parseDuration, parseKm, score, type Surface } from '../runs.ts';
import { run, type Run } from './db/schema.ts';
import type { DB } from './db/index.ts';

export type RunInput = Pick<Run, 'day' | 'route' | 'metres' | 'seconds' | 'climb' | 'surface'>;

/** A run with its pace, score and grade worked out. */
export function withScore(r: Run) {
	const s = score(r.metres, r.seconds, r.climb, r.surface);
	const g = grade(s);
	return { ...r, pace: pace(r.metres, r.seconds), score: s, grade: g.label, emoji: g.emoji };
}

export type ScoredRun = ReturnType<typeof withScore>;

/** Every run, newest first. A few hundred a year, so all of them is fine. */
export async function listRuns(db: DB) {
	const rows = await db.select().from(run).orderBy(desc(run.day), desc(run.id));
	return rows.map(withScore);
}

export async function getRun(db: DB, id: number) {
	const [r] = await db.select().from(run).where(eq(run.id, id));
	return r ? withScore(r) : null;
}

export async function addRun(db: DB, input: RunInput, now = new Date()) {
	const [r] = await db
		.insert(run)
		.values({ ...input, createdAt: now.toISOString() })
		.returning({ id: run.id });
	return r.id;
}

export const updateRun = (db: DB, id: number, input: RunInput) =>
	db.update(run).set(input).where(eq(run.id, id));

export const deleteRun = (db: DB, id: number) => db.delete(run).where(eq(run.id, id));

/**
 * Routes run before, each with its latest distance, climb and surface, so
 * picking one fills the form in. Most-run first.
 */
export function knownRoutes(runs: Run[]) {
	const routes = new Map<
		string,
		{ route: string; km: string; climb: number; surface: Surface; count: number }
	>();
	// Newest first, so the first seen is the latest.
	for (const r of runs) {
		const key = r.route.trim();
		const seen = routes.get(key);
		if (seen) seen.count++;
		else
			routes.set(key, {
				route: key,
				km: (r.metres / 1000).toFixed(2),
				climb: r.climb,
				surface: r.surface,
				count: 1
			});
	}
	return [...routes.values()].sort((a, b) => b.count - a.count || a.route.localeCompare(b.route));
}

export type FormValues = Record<'day' | 'route' | 'km' | 'time' | 'climb' | 'surface', string>;

/** Reads the run form: the run, or what's wrong plus what was typed (to show it again). */
export function parseRunForm(
	form: FormData
): { ok: true; run: RunInput } | { ok: false; error: string; values: FormValues } {
	const get = (k: string) => String(form.get(k) ?? '').trim();
	const values: FormValues = {
		day: get('day'),
		route: get('route'),
		km: get('km'),
		time: get('time'),
		climb: get('climb'),
		surface: get('surface')
	};
	const fail = (error: string) => ({ ok: false as const, error, values });

	if (!isDay(values.day)) return fail('Pick the date of the run.');
	if (!values.route) return fail('Give the route a name.');
	if (values.route.length > 100) return fail('That route name is too long.');
	const metres = parseKm(values.km);
	if (metres === null) return fail('Distance should be in km, like 5.2.');
	const seconds = parseDuration(values.time);
	if (seconds === null) return fail('Time should be minutes:seconds, like 26:39 or 26.39.');
	const climb = values.climb === '' ? 0 : Number(values.climb);
	if (!Number.isInteger(climb) || climb < 0 || climb > 10_000)
		return fail('Elevation gain should be whole metres, like 120.');
	if (!SURFACES.includes(values.surface as Surface)) return fail('Pick a surface.');

	return {
		ok: true,
		run: {
			day: values.day,
			route: values.route,
			metres,
			seconds,
			climb,
			surface: values.surface as Surface
		}
	};
}

/** Km, climb and run count per month (YYYY-MM), newest first. */
export function monthlyTotals(runs: Run[]) {
	const months = new Map<string, { month: string; metres: number; climb: number; runs: number }>();
	for (const r of runs) {
		const month = r.day.slice(0, 7);
		const m = months.get(month) ?? { month, metres: 0, climb: 0, runs: 0 };
		m.metres += r.metres;
		m.climb += r.climb;
		m.runs++;
		months.set(month, m);
	}
	return [...months.values()].sort((a, b) => b.month.localeCompare(a.month));
}

/** Personal bests: top score, fastest pace (runs of 3 km or more), longest, most climb. */
export function bests(runs: ScoredRun[]) {
	const top = <T>(list: T[], by: (r: T) => number) =>
		list.reduce<T | null>((best, r) => (!best || by(r) > by(best) ? r : best), null);
	return {
		score: top(runs, (r) => r.score),
		pace: top(
			runs.filter((r) => r.metres >= 3000),
			(r) => -r.pace
		),
		distance: top(runs, (r) => r.metres),
		climb: top(runs, (r) => r.climb)
	};
}
