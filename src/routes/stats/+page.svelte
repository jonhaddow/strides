<script lang="ts">
	import { formatDay, formatMonth } from '#lib/dates.ts';
	import { formatKm, formatPace } from '#lib/runs.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const b = $derived(data.bests);
	const pbs = $derived(
		[
			b.score && {
				label: 'Best score',
				value: `${b.score.emoji} ${b.score.score.toFixed(1)}`,
				run: b.score
			},
			b.pace && {
				label: 'Fastest pace (3 km+)',
				value: `${formatPace(b.pace.pace)}/km`,
				run: b.pace
			},
			b.distance && {
				label: 'Longest run',
				value: `${formatKm(b.distance.metres)} km`,
				run: b.distance
			},
			b.climb && { label: 'Most climb', value: `${b.climb.climb} m`, run: b.climb }
		].filter((x) => !!x)
	);
	const most = $derived(Math.max(1, ...data.grades.map((g) => g.count)));
</script>

<svelte:head>
	<title>Stats · Strides</title>
</svelte:head>

<main class="page">
	<h1>Stats</h1>

	<dl class="totals">
		<div>
			<dt>Runs</dt>
			<dd>{data.total.runs}</dd>
		</div>
		<div>
			<dt>Km</dt>
			<dd>{Math.round(data.total.metres / 1000)}</dd>
		</div>
		<div>
			<dt>Climbed</dt>
			<dd>{data.total.climb.toLocaleString('en-GB')} m</dd>
		</div>
		<div>
			<dt>Hours</dt>
			<dd>{Math.round(data.total.seconds / 3600)}</dd>
		</div>
	</dl>

	{#if pbs.length}
		<section>
			<h2>Personal bests</h2>
			<ul class="list">
				{#each pbs as pb (pb.label)}
					<li>
						<a href="/runs/{pb.run.id}">
							<span class="what">
								<span class="muted">{pb.label}</span>
								<span>{pb.run.route} · {formatDay(pb.run.day)}</span>
							</span>
							<strong>{pb.value}</strong>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2>Grades</h2>
			<ul class="list grades">
				{#each data.grades as g (g.label)}
					<li>
						<span class="g"><span aria-hidden="true">{g.emoji}</span> {g.label}</span>
						<span class="bar"><span style="width: {(g.count / most) * 100}%"></span></span>
						<span class="n">{g.count}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2>By month</h2>
			<table class="card">
				<thead><tr><th>Month</th><th>Runs</th><th>Km</th><th>Climb</th></tr></thead>
				<tbody>
					{#each data.months as m (m.month)}
						<tr>
							<td>{formatMonth(m.month)}</td>
							<td>{m.runs}</td>
							<td>{formatKm(m.metres)}</td>
							<td>{m.climb} m</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{:else}
		<p class="note">Stats show up after the first run.</p>
	{/if}
</main>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.totals {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin: 0;
	}
	.totals div {
		background: var(--card);
		border-radius: 14px;
		box-shadow: var(--shadow);
		padding: 12px 6px;
		text-align: center;
	}
	dt {
		font-size: 12px;
		color: var(--muted);
	}
	dd {
		margin: 2px 0 0;
		font-weight: 800;
		font-size: 20px;
	}
	.list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		text-decoration: none;
	}
	.what {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.what .muted {
		font-size: 13px;
	}
	.what span:last-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.list strong {
		white-space: nowrap;
	}
	.grades li {
		display: grid;
		grid-template-columns: 52px 1fr 28px;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
	}
	.g {
		font-weight: 700;
	}
	.bar {
		height: 10px;
		border-radius: 5px;
		background: var(--line);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: 5px;
		background: var(--accent);
	}
	.n {
		text-align: right;
		font-weight: 700;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		overflow: hidden;
		font-size: 15px;
	}
	th {
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		text-align: right;
		padding: 10px 14px 6px;
	}
	td {
		text-align: right;
		padding: 10px 14px;
		border-top: 1px solid var(--line);
	}
	th:first-child,
	td:first-child {
		text-align: left;
	}
</style>
