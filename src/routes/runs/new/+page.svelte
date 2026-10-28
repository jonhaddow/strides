<script lang="ts">
	import { enhance } from '$app/forms';
	import RunForm from '#lib/components/RunForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const blank = { day: '', route: '', km: '', time: '', climb: '', surface: '' };
</script>

<svelte:head>
	<title>Log a run · Strides</title>
</svelte:head>

<main class="page">
	<a class="back" href="/">‹ Runs</a>
	<h1>Log a run</h1>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	<form
		method="POST"
		use:enhance={() =>
			({ update }) =>
				update({ reset: false })}
	>
		{#key form}
			<RunForm values={form?.values ?? blank} routes={data.routes} submit="Save run" />
		{/key}
	</form>
</main>
