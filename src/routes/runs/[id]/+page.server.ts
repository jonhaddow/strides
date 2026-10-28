import { error, fail, redirect } from '@sveltejs/kit';
import { formatDuration } from '#lib/runs.ts';
import {
	deleteRun,
	getRun,
	knownRoutes,
	listRuns,
	parseRunForm,
	updateRun
} from '#lib/server/runs.ts';
import type { Actions, PageServerLoad } from './$types';

function runId(param: string) {
	const id = Number(param);
	if (!Number.isInteger(id) || id <= 0) error(404, 'No such run');
	return id;
}

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const run = await getRun(locals.db, runId(params.id));
	if (!run) error(404, 'No such run');
	return {
		run,
		values: {
			day: run.day,
			route: run.route,
			km: (run.metres / 1000).toFixed(2),
			time: formatDuration(run.seconds),
			climb: String(run.climb),
			surface: run.surface
		},
		routes: knownRoutes(await listRuns(locals.db)),
		saved: url.searchParams.has('saved')
	};
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const result = parseRunForm(await request.formData());
		if (!result.ok) return fail(400, result);
		await updateRun(locals.db, runId(params.id), result.run);
		redirect(303, '/');
	},
	delete: async ({ params, locals }) => {
		await deleteRun(locals.db, runId(params.id));
		redirect(303, '/');
	}
};
