import { listRuns, monthlyTotals } from '#lib/server/runs.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const runs = await listRuns(locals.db);
	return { runs, months: monthlyTotals(runs) };
};
