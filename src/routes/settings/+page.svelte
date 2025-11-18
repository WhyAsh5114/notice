<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import {
		deleteAllNotifications,
		exportNotifications,
		importNotifications
	} from '$lib/my-utils.js';
	import { FileDownIcon, FileUpIcon } from '@lucide/svelte';
	import { setMode, userPrefersMode } from 'mode-watcher';

	let isExporting = $state(false);
	let isImporting = $state(false);
	let isDeleting = $state(false);

	async function handleExport() {
		isExporting = true;
		try {
			await exportNotifications();
		} finally {
			isExporting = false;
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

	async function handleDeleteAll() {
		isDeleting = true;
		try {
			await deleteAllNotifications();
		} finally {
			isDeleting = false;
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
		<Card.Title>Export notifications</Card.Title>
		<Card.Description>Export all notifications to a CSV file in Documents folder</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-end">
		<Button onclick={handleExport} disabled={isExporting}>
			{#if isExporting}
				<Spinner class="mr-2 size-4" />
				Exporting...
			{:else}
				<FileUpIcon class="mr-2 size-4" />
				Export
			{/if}
		</Button>
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

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Delete all notifications</Card.Title>
		<Card.Description
			>Permanently delete all stored notifications from the database</Card.Description
		>
	</Card.Header>
	<Card.Content class="flex justify-end">
		<Button variant="destructive" onclick={handleDeleteAll} disabled={isDeleting}>
			{#if isDeleting}
				<Spinner class="mr-2 size-4" />
				Deleting...
			{:else}
				Delete All
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
