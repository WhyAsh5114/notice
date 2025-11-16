<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { BellOffIcon } from '@lucide/svelte';
	import { NotificationReader } from 'capacitor-notification-reader';
	import { toast } from 'svelte-sonner';

	type PropsType = { permissionGranted: boolean | undefined };
	let { permissionGranted = $bindable(false) }: PropsType = $props();

	async function openAccessSettings() {
		const { enabled } = await NotificationReader.openAccessSettings();
		permissionGranted = enabled;

		if (enabled) toast.success('Notification access granted');
		else toast.error('Notification access not granted');
	}
</script>

{#if !permissionGranted}
	<Empty.Root class="w-full">
		<Empty.Header>
			<Empty.Media variant="icon">
				<BellOffIcon />
			</Empty.Media>
			<Empty.Title>Permission required</Empty.Title>
			<Empty.Description>
				To use this app, please enable notification access in your device settings
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button onclick={openAccessSettings}>Grant permission</Button>
		</Empty.Content>
	</Empty.Root>
{/if}
