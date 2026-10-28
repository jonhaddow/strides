<script lang="ts">
	import type { LayoutProps } from './$types';
	import { beforeNavigate, onNavigate } from '$app/navigation';
	import { page, updated } from '$app/state';
	// Served with the app (not Google Fonts): no extra connections before text shows.
	import '@fontsource-variable/outfit';
	import font from '@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url';
	import './app.css';

	let { data, children }: LayoutProps = $props();

	const path = $derived(page.url.pathname);
	const tabs = $derived([
		{ href: '/', label: 'Runs', icon: 'runs', active: path === '/' || path.startsWith('/runs') },
		{ href: '/stats', label: 'Stats', icon: 'stats', active: path === '/stats' },
		{ href: '/settings', label: 'Settings', icon: 'settings', active: path === '/settings' }
	]);

	// A new version was deployed: load it fully on the next tap.
	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) location.href = to.url.href;
	});

	// Coming back to the app from the background: if a new version was deployed
	// meanwhile, load it straight away.
	async function reloadIfUpdated() {
		if (document.visibilityState === 'visible' && (await updated.check())) location.reload();
	}

	// Pages crossfade into each other (app.css), where the browser can. The tabs stay put.
	onNavigate((navigation) => {
		if (!document.startViewTransition || navigation.to?.url.pathname === page.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preload" href={font} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<svelte:document onvisibilitychange={reloadIfUpdated} />

{@render children()}

{#if data.user}
	<!-- Each tab's code loads straight away, so the first tap only waits for data. -->
	<nav class="tabs" aria-label="Main" data-sveltekit-preload-code="eager">
		{#each tabs as tab (tab.href)}
			<a href={tab.href} class:active={tab.active} aria-current={tab.active ? 'page' : undefined}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					{#if tab.icon === 'runs'}
						<!-- A running shoe. -->
						<path
							d="M3 16.5V9.8c0-.6.6-1 1.1-.7l2.4 1.2c1.2.6 2.6.3 3.4-.8L12 7l3.2 4.3c.6.8 1.5 1.3 2.5 1.4l2.3.3c.6.1 1 .6 1 1.2v2.3H3ZM3 16.5v1.2c0 .4.3.8.8.8h16.4c.4 0 .8-.4.8-.8v-1.2M9 12l1.2 1.2M11 10.5l1.2 1.2"
						/>
					{:else if tab.icon === 'stats'}
						<path d="M5 20V12M10 20V6M15 20v-9M20 20V4" />
					{:else}
						<circle cx="12" cy="12" r="3" />
						<path
							d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"
						/>
					{/if}
				</svg>
				<span>{tab.label}</span>
			</a>
		{/each}
	</nav>
{/if}

<style>
	/* A floating, frosted pill; the page scrolls under it. */
	nav {
		view-transition-name: tabs;
		position: fixed;
		left: 50%;
		bottom: calc(12px + env(safe-area-inset-bottom));
		translate: -50% 0;
		width: min(calc(100% - 32px), 360px);
		height: var(--tabs);
		padding: 6px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--card) 78%, transparent);
		backdrop-filter: blur(20px) saturate(1.6);
		-webkit-backdrop-filter: blur(20px) saturate(1.6);
		border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
		box-shadow: 0 8px 28px rgb(0 0 0 / 0.12);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	nav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		color: var(--muted);
		text-decoration: none;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	nav svg {
		width: 24px;
		height: 24px;
		transition: scale 0.1s ease-out;
	}
	/* Pressed: the icon shrinks a little. */
	nav a:active svg {
		scale: 0.85;
	}
	nav a.active {
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
	}
</style>
