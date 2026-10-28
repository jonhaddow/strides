<script lang="ts">
	import { enhance } from '$app/forms';
	import RunForm from '#lib/components/RunForm.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { formatDay } from '#lib/dates.ts';
	import { formatDuration, formatKm, formatPace } from '#lib/runs.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const r = $derived(data.run);
</script>

<svelte:head>
	<title>{r.route} · Strides</title>
</svelte:head>

<main class="page">
	<a class="back" href="/">‹ Runs</a>

	<section class="hero card">
		<span class="emoji" aria-hidden="true">{r.emoji}</span>
		<div>
			<p class="muted">{data.saved ? 'Saved! ' : ''}{formatDay(r.day)}</p>
			<h1>Grade {r.grade}</h1>
			<p>Score {r.score.toFixed(1)}</p>
		</div>
	</section>

	<dl class="stats">
		<div>
			<dt>Distance</dt>
			<dd>{formatKm(r.metres)} km</dd>
		</div>
		<div>
			<dt>Time</dt>
			<dd>{formatDuration(r.seconds)}</dd>
		</div>
		<div>
			<dt>Pace</dt>
			<dd>{formatPace(r.pace)}/km</dd>
		</div>
		<div>
			<dt>Climb</dt>
			<dd>{r.climb} m</dd>
		</div>
	</dl>

	<h2>Edit</h2>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	<form
		method="POST"
		action="?/save"
		use:enhance={() =>
			({ update }) =>
				update({ reset: false })}
	>
		{#key form}
			<RunForm values={form?.values ?? data.values} routes={data.routes} submit="Save changes" />
		{/key}
	</form>

	<form
		method="POST"
		action="?/delete"
		use:enhance={({ cancel }) => {
			if (!confirm(`Delete ${r.route} on ${formatDay(r.day)}?`)) cancel();
		}}
	>
		<Button variant="destructive" class="w-full">Delete this run</Button>
	</form>
</main>

<style>
	.hero {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px;
	}
	.emoji {
		font-size: 52px;
		line-height: 1;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin: 0;
	}
	.stats div {
		background: var(--card);
		border-radius: 14px;
		box-shadow: var(--shadow);
		padding: 10px 8px;
		text-align: center;
	}
	dt {
		font-size: 12px;
		color: var(--muted);
	}
	dd {
		margin: 2px 0 0;
		font-weight: 700;
		font-size: 15px;
	}
</style>
