<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { deleteAllNotifications } from '$lib/my-utils.js';
	import { Capacitor } from '@capacitor/core';
	import { NotificationReader } from 'capacitor-notification-reader';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Debounced } from 'runed';

	let isDeleting = $state(false);
	let storageLimitEnabled = $state(false);
	let storageLimitMB = $state(50);
	let currentStorageMB = $state<number | undefined>(undefined);
	let filterOngoing = $state(true);
	let filterTransport = $state(true);
	let isLoadingConfig = $state(true);
	let configTrigger = $state(0);

	const debouncedConfigTrigger = new Debounced(() => configTrigger, 500);

	async function handleDeleteAll() {
		isDeleting = true;
		try {
			await deleteAllNotifications();
			await calculateCurrentStorage();
		} finally {
			isDeleting = false;
		}
	}

	async function loadConfig() {
		if (!Capacitor.isNativePlatform()) return;

		try {
			const config = await NotificationReader.getConfig();
			storageLimitEnabled = config.storageLimit !== undefined;
			storageLimitMB = config.storageLimit ?? 50;
			filterOngoing = config.filterOngoing ?? true;
			filterTransport = config.filterTransport ?? true;
		} catch (error) {
			console.error('Failed to load config:', error);
			toast.error('Failed to load settings');
		} finally {
			isLoadingConfig = false;
		}
	}

	async function saveConfig() {
		if (!Capacitor.isNativePlatform()) return;

		try {
			const config = await NotificationReader.getConfig();
			await NotificationReader.setConfig({
				...config,
				storageLimit: storageLimitEnabled ? storageLimitMB : undefined,
				filterOngoing,
				filterTransport
			});
			toast.success('Settings saved');
		} catch (error) {
			console.error('Failed to save config:', error);
			toast.error('Failed to save settings');
		}
	}

	$effect(() => {
		if (debouncedConfigTrigger.current > 0) {
			saveConfig();
		}
	});

	async function calculateCurrentStorage() {
		if (!Capacitor.isNativePlatform()) {
			currentStorageMB = undefined;
			return;
		}

		try {
			const { sizeMB } = await NotificationReader.getDatabaseSize();
			currentStorageMB = Number(sizeMB.toFixed(2));
		} catch (error) {
			console.error('Failed to get storage info:', error);
			currentStorageMB = undefined;
		}
	}

	onMount(() => {
		loadConfig();
		calculateCurrentStorage();
	});
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Storage Limit</Card.Title>
		<Card.Description>Configure automatic cleanup of old notifications</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-6">
		{#if isLoadingConfig}
			<div class="flex items-center justify-center py-4">
				<Spinner class="size-6" />
			</div>
		{:else}
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-2 rounded-md border p-4">
					<div class="flex flex-col gap-1">
						<label for="storage-limit-toggle" class="text-sm leading-none font-medium">
							Enable Storage Limit
						</label>
						<p class="text-sm text-muted-foreground">
							Automatically remove old notifications when limit is reached
						</p>
					</div>
					<Switch
						id="storage-limit-toggle"
						bind:checked={storageLimitEnabled}
						onCheckedChange={() => configTrigger++}
					/>
				</div>

				{#if storageLimitEnabled}
					<div class="flex flex-col gap-2 rounded-md border p-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Limit: {storageLimitMB} MB</span>
							{#if currentStorageMB !== undefined}
								<span class="text-sm text-muted-foreground">
									Current: {currentStorageMB} MB
								</span>
							{/if}
						</div>
						<Slider
							type="single"
							bind:value={storageLimitMB}
							min={10}
							max={500}
							step={10}
							onValueChange={() => configTrigger++}
						/>
					</div>
				{/if}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Filter Ongoing Notifications</Card.Title>
		<Card.Description>
			Exclude downloads, backups, uploads, and other in-progress activities
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if isLoadingConfig}
			<div class="flex items-center justify-center py-4">
				<Spinner class="size-6" />
			</div>
		{:else}
			<div class="flex items-center justify-between gap-2 rounded-md border p-4">
				<div class="flex flex-col gap-1">
					<label for="filter-ongoing" class="text-sm leading-none font-medium">
						Exclude ongoing notifications
					</label>
					<p class="text-sm text-muted-foreground">
						Helps reduce storage usage by filtering transient notifications
					</p>
				</div>
				<Switch
					id="filter-ongoing"
					bind:checked={filterOngoing}
					onCheckedChange={() => configTrigger++}
				/>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Title>Filter Transport Notifications</Card.Title>
		<Card.Description>
			Exclude media playback notifications (music, podcasts, etc.)
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if isLoadingConfig}
			<div class="flex items-center justify-center py-4">
				<Spinner class="size-6" />
			</div>
		{:else}
			<div class="flex items-center justify-between gap-2 rounded-md border p-4">
				<div class="flex flex-col gap-1">
					<label for="filter-transport" class="text-sm leading-none font-medium">
						Exclude transport notifications
					</label>
					<p class="text-sm text-muted-foreground">
						Helps reduce storage usage by filtering media playback notifications
					</p>
				</div>
				<Switch
					id="filter-transport"
					bind:checked={filterTransport}
					onCheckedChange={() => configTrigger++}
				/>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

{#if !isLoadingConfig}
	<Card.Root class="gap-4">
		<Card.Header>
			<Card.Title>Current Storage</Card.Title>
			<Card.Description>View database size consumed by stored notifications</Card.Description>
		</Card.Header>
		<Card.Content class="flex justify-end">
			{#if currentStorageMB !== undefined}
				<Button variant="outline">
					{currentStorageMB} MB
				</Button>
			{:else}
				<p class="text-sm text-muted-foreground">Unable to retrieve storage information</p>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}

{#if !isLoadingConfig}
	<Card.Root class="gap-4">
		<Card.Header>
			<Card.Title>Delete all notifications</Card.Title>
			<Card.Description>
				Permanently delete all stored notifications from the database
			</Card.Description>
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
{/if}
