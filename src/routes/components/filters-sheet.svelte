<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { FunnelPlusIcon } from '@lucide/svelte';
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Button size="icon" variant="outline" title="Add filter">
			<FunnelPlusIcon />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Filter notifications</Sheet.Title>
			<Sheet.Description>Add more filters to narrow down your notification list</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
