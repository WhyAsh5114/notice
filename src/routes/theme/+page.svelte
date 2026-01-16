<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { setMode, userPrefersMode } from 'mode-watcher';
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
