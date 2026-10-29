<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { todayHere } from '#lib/dates.ts';
	import { SURFACES, grade, parseDuration, parseKm, score, type Surface } from '#lib/runs.ts';

	type Values = Record<'day' | 'route' | 'km' | 'time' | 'climb' | 'surface', string>;
	type Route = { route: string; km: string; climb: number; surface: Surface };

	let {
		values: initial,
		routes,
		submit
	}: { values: Values; routes: Route[]; submit: string } = $props();

	// Editable copies of what the server sent (a new run starts blank).
	// svelte-ignore state_referenced_locally
	let v = $state({ ...initial });

	// A new run is today, on this phone (the runner may be anywhere in the world).
	$effect(() => {
		if (!v.day) v.day = todayHere();
	});

	// Picking a route run before fills in its distance, climb and surface.
	function fillRoute() {
		const known = routes.find((r) => r.route.toLowerCase() === v.route.trim().toLowerCase());
		if (!known) return;
		v.km = known.km;
		v.climb = String(known.climb);
		v.surface = known.surface;
	}

	// The score as it's typed.
	const preview = $derived.by(() => {
		const metres = parseKm(v.km);
		const seconds = parseDuration(v.time);
		const climb = v.climb === '' ? 0 : Number(v.climb);
		if (!metres || !seconds || !Number.isFinite(climb) || !SURFACES.includes(v.surface as Surface))
			return null;
		const s = score(metres, seconds, climb, v.surface as Surface);
		return { score: s.toFixed(1), ...grade(s) };
	});
</script>

<div class="fields">
	<label class="field">
		Route
		<input
			name="route"
			list="routes"
			autocomplete="off"
			required
			maxlength="100"
			bind:value={v.route}
			onchange={fillRoute}
		/>
		<datalist id="routes">
			{#each routes as r (r.route)}<option value={r.route}></option>{/each}
		</datalist>
	</label>

	<label class="field">
		Date
		<input type="date" name="day" required bind:value={v.day} />
	</label>

	<div class="pair">
		<label class="field">
			Distance (km)
			<input name="km" inputmode="decimal" required placeholder="5.00" bind:value={v.km} />
		</label>
		<label class="field">
			Time (min:sec)
			<input name="time" inputmode="decimal" required placeholder="26:39" bind:value={v.time} />
		</label>
	</div>

	<label class="field">
		Elevation gain (m)
		<input name="climb" inputmode="numeric" placeholder="0" bind:value={v.climb} />
	</label>

	<fieldset class="field">
		<legend>Surface</legend>
		<div class="chips">
			{#each SURFACES as s (s)}
				<label class="chip">
					<input type="radio" name="surface" value={s} required bind:group={v.surface} />
					{s}
				</label>
			{/each}
		</div>
	</fieldset>

	<div class="preview card" aria-live="polite">
		{#if preview}
			<span class="emoji" aria-hidden="true">{preview.emoji}</span>
			<span><strong>Grade {preview.label}</strong> · score {preview.score}</span>
		{:else}
			<span class="muted">The grade shows here as you fill it in.</span>
		{/if}
	</div>

	<Button type="submit" class="w-full">{submit}</Button>
</div>

<style>
	.fields {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.pair > * {
		min-width: 0;
	}
	.pair input {
		width: 100%;
	}
	fieldset {
		border: 0;
		margin: 0;
		padding: 0;
	}
	legend {
		padding: 0;
		margin-bottom: 6px;
	}
	.preview {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		min-height: 56px;
	}
	.emoji {
		font-size: 24px;
	}
</style>
