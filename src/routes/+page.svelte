<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { formatDay, formatMonth } from '#lib/dates.ts';
	import { formatDuration, formatKm, formatPace } from '#lib/runs.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Runs grouped by month, each with its totals.
	const groups = $derived(
		data.months.map((m) => ({ ...m, runs: data.runs.filter((r) => r.day.startsWith(m.month)) }))
	);
</script>

<svelte:head>
	<title>Strides</title>
</svelte:head>

<main class="page">
	<header>
		<h1>Strides</h1>
		<Button href="/runs/new">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg
			>
			Log a run
		</Button>
	</header>

	{#each groups as m (m.month)}
		<section>
			<div class="month">
				<h2>{formatMonth(m.month)}</h2>
				<p class="muted">{formatKm(m.metres)} km · {m.climb} m up</p>
			</div>
			<ul class="list">
				{#each m.runs as r (r.id)}
					<li>
						<a href="/runs/{r.id}">
							<span
								class="grade grade-{r.grade.replace('+', 'plus')}"
								title="Score {r.score.toFixed(1)}"
							>
								<span aria-hidden="true">{r.emoji}</span>
								<span class="letter">{r.grade}</span>
							</span>
							<span class="what">
								<strong>{r.route}</strong>
								<span class="muted">{formatDay(r.day)} · {r.surface}</span>
							</span>
							<span class="numbers">
								<strong>{formatKm(r.metres)} km</strong>
								<span class="muted">{formatDuration(r.seconds)} · {formatPace(r.pace)}/km</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<p class="note">No runs yet. Tap <strong>Log a run</strong> after your next one.</p>
	{/each}
</main>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.month {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		padding: 0 4px;
	}
	.month p {
		font-size: 14px;
	}
	.list a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		text-decoration: none;
	}
	.grade {
		flex: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: var(--line);
		font-size: 17px;
		line-height: 1.1;
	}
	.grade .letter {
		font-size: 12px;
		font-weight: 800;
	}
	.grade-Aplus,
	.grade-A {
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		color: var(--accent);
	}
	.grade-B {
		background: color-mix(in srgb, var(--good) 14%, transparent);
		color: var(--good);
	}
	.what,
	.numbers {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.what {
		flex: 1;
	}
	.what strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.numbers {
		align-items: flex-end;
		text-align: right;
	}
	.muted {
		font-size: 13px;
	}
</style>
