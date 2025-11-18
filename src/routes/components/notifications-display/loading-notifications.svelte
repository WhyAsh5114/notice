<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
</script>

<Empty.Root class="w-full">
	<Empty.Header>
		<Empty.Media variant="icon">
			<Spinner />
		</Empty.Media>
		<Empty.Title>Loading notifications</Empty.Title>
		<Empty.Description>Please wait while we load your notifications</Empty.Description>
	</Empty.Header>
</Empty.Root>
