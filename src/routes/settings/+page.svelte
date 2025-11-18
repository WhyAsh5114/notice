<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { NotificationReader } from 'capacitor-notification-reader';
	import { setMode, userPrefersMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	async function handleDeleteAll() {
		try {
			await NotificationReader.deleteAllNotifications();
			toast.success('All notifications deleted');
		} catch (error) {
			toast.error('Failed to delete notifications');
			console.error(error);
		}
	}
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Color mode</Card.Title>
		<Card.Description>Manage the app's color mode settings</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-end">
		<Select.Root
			type="single"
			value={userPrefersMode.current}
			onValueChange={(v) => setMode(v as Parameters<typeof setMode>[0])}
		>
			<Select.Trigger class="capitalize">
				{userPrefersMode.current}
			</Select.Trigger>
			<Select.Content align="end">
				<Select.Item value="light">Light</Select.Item>
				<Select.Item value="dark">Dark</Select.Item>
				<Select.Item value="system">System</Select.Item>
			</Select.Content>
		</Select.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Delete all notifications</Card.Title>
		<Card.Description>Permanently delete all stored notifications from the database</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-end">
		<Button variant="destructive" onclick={handleDeleteAll}>Delete All</Button>
	</Card.Content>
</Card.Root>
