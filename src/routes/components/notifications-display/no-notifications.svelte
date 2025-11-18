<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { BellDotIcon } from '@lucide/svelte';
</script>

<Empty.Root class="w-full h-full">
	<Empty.Header>
		<Empty.Media variant="icon">
			<BellDotIcon />
		</Empty.Media>
		<Empty.Title>No notifications yet</Empty.Title>
		<Empty.Description>
			The app has started recording notifications but there are no notifications to display yet
		</Empty.Description>
	</Empty.Header>
</Empty.Root>
