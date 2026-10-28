import { fail, redirect } from '@sveltejs/kit';
import { addRun, knownRoutes, listRuns, parseRunForm } from '#lib/server/runs.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => ({
	routes: knownRoutes(await listRuns(locals.db))
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const result = parseRunForm(await request.formData());
		if (!result.ok) return fail(400, result);
		const id = await addRun(locals.db, result.run);
		redirect(303, `/runs/${id}?saved=1`);
	}
};
