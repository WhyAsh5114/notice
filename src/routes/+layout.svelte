<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import CustomScrollArea from '$lib/components/ui/scroll-area/custom-scroll-area.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { formatHex, oklch } from 'culori';
	import { mode, ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import LinkBreadcrumbs from './components/link-breadcrumbs.svelte';
	import { Capacitor } from '@capacitor/core';

	let { children } = $props();

	function oklchToHex(oklchString: string): string {
		const cleaned = oklchString.replace(/oklch\(|\)/g, '').trim();
		const [l, c, h] = cleaned.split(/\s+/).map((val, index) => {
			const num = parseFloat(val);
			if (index === 0) return Math.max(0, Math.min(1, num)); // lightness
			if (index === 1) return Math.max(0, Math.min(0.4, num)); // chroma
			if (index === 2) return num % 360; // hue
			return num;
		});

		const oklchColor = { mode: 'oklch' as const, l, c, h: h || 0 };
		return formatHex(oklchColor) || '#000000';
	}

	$effect(() => {
		if (!mode.current) return;
		if (!Capacitor.isNativePlatform()) return;
		requestAnimationFrame(() => {
			const computedStyle = getComputedStyle(document.documentElement);
			const backgroundColor = computedStyle.getPropertyValue('--background').trim();
			const hexColor = oklchToHex(backgroundColor);

			StatusBar.setBackgroundColor({ color: hexColor });
			StatusBar.setStyle({ style: mode.current === 'dark' ? Style.Dark : Style.Light });
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster />

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<div class="mx-auto flex h-screen w-full max-w-xl flex-col">
			<header
				class="sticky top-0 z-50 flex min-h-12 items-center gap-2 bg-background/80 px-4 py-2 backdrop-blur-sm"
			>
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 h-6" />
				<LinkBreadcrumbs />
			</header>
			<CustomScrollArea class="h-px w-full grow">
				<main class="flex w-full grow flex-col gap-2 p-4 pt-2">
					{@render children?.()}
				</main>
			</CustomScrollArea>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
