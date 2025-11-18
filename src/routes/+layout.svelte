<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import CustomScrollArea from '$lib/components/ui/scroll-area/custom-scroll-area.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { oklchToHex } from '$lib/my-utils';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { mode, ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import LinkBreadcrumbs from './components/link-breadcrumbs.svelte';

	let { children } = $props();

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
