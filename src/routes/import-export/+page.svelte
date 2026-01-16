<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Progress from '$lib/components/ui/progress/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { exportNotifications, importNotifications } from '$lib/my-utils.js';
	import { FileDownIcon, FileUpIcon } from '@lucide/svelte';

	let isExporting = $state(false);
	let isImporting = $state(false);
	let exportProgress = $state(0);
	let exportTotal = $state(0);

	async function handleExport() {
		isExporting = true;
		exportProgress = 0;
		exportTotal = 0;
		try {
			await exportNotifications((current, total) => {
				exportProgress = current;
				exportTotal = total;
			});
		} finally {
			isExporting = false;
			exportProgress = 0;
			exportTotal = 0;
		}
	}

	async function handleImport() {
		isImporting = true;
		try {
			await importNotifications();
		} finally {
			isImporting = false;
		}
	}
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Export notifications</Card.Title>
		<Card.Description>Export all notifications to a CSV file in Documents folder</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4">
		{#if isExporting && exportTotal > 0}
			<div class="space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Exporting notifications...</span>
					<span class="font-medium">{exportProgress} / {exportTotal}</span>
				</div>
				<Progress.Root value={(exportProgress / exportTotal) * 100} />
			</div>
		{/if}
		<div class="flex justify-end">
			<Button onclick={handleExport} disabled={isExporting}>
				{#if isExporting}
					<Spinner class="mr-2 size-4" />
					Exporting...
				{:else}
					<FileUpIcon class="mr-2 size-4" />
					Export
				{/if}
			</Button>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Import notifications</Card.Title>
		<Card.Description>Import notifications from a CSV file</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-end">
		<Button onclick={handleImport} disabled={isImporting}>
			{#if isImporting}
				<Spinner class="mr-2 size-4" />
				Importing...
			{:else}
				<FileDownIcon class="mr-2 size-4" />
				Import
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
