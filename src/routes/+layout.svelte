<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { mode, ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		if (mode.current === 'dark') {
			StatusBar.setBackgroundColor({ color: '#000000' });
			StatusBar.setStyle({ style: Style.Dark });
		} else if (mode.current === 'light') {
			StatusBar.setBackgroundColor({ color: '#ffffff' });
			StatusBar.setStyle({ style: Style.Light });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster />
<main class="flex h-screen flex-col items-center justify-center p-4">
	{@render children()}
</main>
