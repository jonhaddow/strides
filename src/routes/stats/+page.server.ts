import { GRADES } from '#lib/runs.ts';
import { bests, listRuns, monthlyTotals } from '#lib/server/runs.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const runs = await listRuns(locals.db);
	return {
		total: {
			runs: runs.length,
			metres: runs.reduce((n, r) => n + r.metres, 0),
			climb: runs.reduce((n, r) => n + r.climb, 0),
			seconds: runs.reduce((n, r) => n + r.seconds, 0)
		},
		bests: bests(runs),
		grades: GRADES.map((g) => ({ ...g, count: runs.filter((r) => r.grade === g.label).length })),
		months: monthlyTotals(runs)
	};
};
