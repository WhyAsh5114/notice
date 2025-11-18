<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { FunnelXIcon } from '@lucide/svelte';
</script>

<Empty.Root class="h-full w-full">
	<Empty.Header>
		<Empty.Media variant="icon">
			<FunnelXIcon />
		</Empty.Media>
		<Empty.Title>No notifications</Empty.Title>
		<Empty.Description>
			There are no notifications to display with the current filter settings
		</Empty.Description>
	</Empty.Header>
</Empty.Root>
