<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { cn } from '$lib/utils';
	import { CheckIcon, ChevronsUpDownIcon, FunnelPlusIcon, XIcon } from '@lucide/svelte';
	import {
		NotificationCategory,
		NotificationReader,
		NotificationStyle,
		type InstalledApp
	} from 'capacitor-notification-reader';
	import { InfiniteLoader, LoaderState } from 'svelte-infinite';
	import { notificationsState } from '../notifications-state.svelte';

	let open = $state(false);

	// App combobox state
	let appsOpen = $state(false);
	let appsTriggerRef = $state<HTMLButtonElement>(null!);
	let installedApps = $state<InstalledApp[]>([]);
	let appsLoading = $state(false);
	let searchQuery = $state('');

	// Infinite scroll state
	const PAGE_SIZE = 25;
	let loaderState = $state(new LoaderState());
	let visibleCount = $state(PAGE_SIZE);
	let commandListRef = $state<HTMLDivElement | null>(null);

	// Filter apps based on search
	const searchFilteredApps = $derived.by(() => {
		if (!searchQuery.trim()) return installedApps;
		const query = searchQuery.toLowerCase();
		return installedApps.filter((app) => app.appName.toLowerCase().includes(query));
	});

	// Get visible apps (paginated)
	const visibleApps = $derived(searchFilteredApps.slice(0, visibleCount));
	const hasMoreApps = $derived(visibleCount < searchFilteredApps.length);

	// Reset pagination when search changes
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		searchQuery; // track dependency
		visibleCount = PAGE_SIZE;
		loaderState.reset();
	});

	// Load more apps for infinite scroll
	async function loadMoreApps() {
		if (!hasMoreApps) {
			loaderState.complete();
			return;
		}

		// Small delay to prevent jarring
		await new Promise((r) => setTimeout(r, 50));
		visibleCount += PAGE_SIZE;

		if (visibleCount >= searchFilteredApps.length) {
			loaderState.complete();
		} else {
			loaderState.loaded();
		}
	}

	// Load installed apps when the popover opens
	async function loadInstalledApps() {
		if (installedApps.length > 0) return;

		appsLoading = true;
		try {
			const result = await NotificationReader.getInstalledApps();
			installedApps = result.apps.sort((a, b) => a.appName.localeCompare(b.appName));
		} catch {
			// Fallback for web or errors - leave empty
			installedApps = [];
		} finally {
			appsLoading = false;
		}
	}

	// Toggle app selection
	function toggleAppSelection(appName: string) {
		const currentApps = notificationsState.filters.apps ?? [];
		if (currentApps.includes(appName)) {
			notificationsState.filters.apps = currentApps.filter((a) => a !== appName);
			if (notificationsState.filters.apps.length === 0) {
				notificationsState.filters.apps = undefined;
			}
		} else {
			notificationsState.filters.apps = [...currentApps, appName];
		}
	}

	function isAppSelected(appName: string): boolean {
		return notificationsState.filters.apps?.includes(appName) ?? false;
	}

	// Convert enums to arrays for select options
	const categoryOptions = Object.entries(NotificationCategory).map(([key, value]) => ({
		value,
		label: key
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase())
	}));

	const styleOptions = Object.entries(NotificationStyle).map(([key, value]) => ({
		value,
		label: key
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase())
	}));

	const booleanOptions = [
		{ value: 'true', label: 'Yes' },
		{ value: 'false', label: 'No' }
	];

	function handleApplyFilters() {
		notificationsState.applyFilters();
		open = false;
	}

	function handleClearFilters() {
		notificationsState.clearFilters();
		open = false;
	}

	// Helper to get selected value for boolean selects
	function getBooleanSelectValue(value: boolean | undefined): string | undefined {
		if (value === undefined) return undefined;
		return value.toString();
	}

	// Helper to set boolean filter from select
	function setBooleanFilter(value: string | undefined, filterKey: 'isOngoing' | 'isGroupSummary') {
		if (value === undefined || value === '') {
			notificationsState.filters[filterKey] = undefined;
		} else {
			notificationsState.filters[filterKey] = value === 'true';
		}
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		<Button size="icon" variant="outline" title="Add filter">
			<FunnelPlusIcon />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="w-11/12 overflow-y-auto">
		<Sheet.Header>
			<Sheet.Title>Filter notifications</Sheet.Title>
			<Sheet.Description>Add filters to narrow down your notification list</Sheet.Description>
		</Sheet.Header>

		<div class="grid grid-cols-2 items-end gap-x-2 gap-y-4 px-4">
			<!-- App Names -->
			<div class="col-span-full flex flex-col gap-2">
				<Label for="app-names">App Names</Label>
				<Popover.Root bind:open={appsOpen} onOpenChange={(isOpen) => isOpen && loadInstalledApps()}>
					<Popover.Trigger bind:ref={appsTriggerRef}>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-full justify-between"
								{...props}
								role="combobox"
								aria-expanded={appsOpen}
							>
								{#if notificationsState.filters.apps && notificationsState.filters.apps.length > 0}
									<span class="flex items-center gap-1 truncate">
										{notificationsState.filters.apps.slice(0, 3).join(', ')}
										{#if notificationsState.filters.apps.length > 3}
											<span class="text-muted-foreground">
												+{notificationsState.filters.apps.length - 3} more
											</span>
										{/if}
									</span>
								{:else}
									<span class="text-muted-foreground">Select apps...</span>
								{/if}
								<ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-(--bits-popover-anchor-width) p-0">
						<Command.Root shouldFilter={false}>
							<Command.Input placeholder="Search apps..." bind:value={searchQuery} />
							<Command.List class="max-h-[300px]" bind:ref={commandListRef}>
								{#if appsLoading}
									<Command.Loading>
										<div
											class="flex items-center justify-center gap-2 p-2 text-xs text-muted-foreground"
										>
											<Spinner />
											Loading apps <span class="italic">(this may take a while...)</span>
										</div>
									</Command.Loading>
								{:else if searchFilteredApps.length === 0}
									<Command.Empty
										class="flex items-center justify-center gap-2 p-2 text-xs text-muted-foreground"
									>
										No apps found
									</Command.Empty>
								{:else}
									<Command.Group>
										<InfiniteLoader
											{loaderState}
											triggerLoad={loadMoreApps}
											intersectionOptions={{
												root: commandListRef,
												rootMargin: '0px 0px 100px 0px'
											}}
										>
											{#each visibleApps as app (app.packageName)}
												<Command.Item
													value={app.appName}
													onSelect={() => {
														toggleAppSelection(app.appName);
													}}
												>
													<div class="flex items-center gap-2">
														{#if app.appIcon}
															<img
																src={`data:image/png;base64,${app.appIcon}`}
																alt=""
																class="size-5 rounded"
																loading="lazy"
																decoding="async"
															/>
														{/if}
														<span class="truncate">{app.appName}</span>
													</div>
													<CheckIcon
														class={cn(
															'me-2 size-4',
															!isAppSelected(app.appName) && 'text-transparent'
														)}
													/>
												</Command.Item>
											{/each}
											{#snippet loading()}
												<div class="flex items-center justify-center p-2">
													<Spinner class="size-4" />
												</div>
											{/snippet}
											{#snippet noData()}
												<!-- All apps loaded, nothing to show -->
											{/snippet}
											{#snippet noResults()}
												<!-- No results message handled above -->
											{/snippet}
										</InfiniteLoader>
									</Command.Group>
								{/if}
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				{#if notificationsState.filters.apps && notificationsState.filters.apps.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each notificationsState.filters.apps as appName (appName)}
							<span
								class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
							>
								{appName}
								<button
									type="button"
									class="hover:text-destructive"
									onclick={() => toggleAppSelection(appName)}
								>
									<XIcon class="size-3" />
								</button>
							</span>
						{/each}
						<button
							type="button"
							class="text-xs text-muted-foreground underline hover:text-foreground"
							onclick={() => (notificationsState.filters.apps = undefined)}
						>
							Clear all
						</button>
					</div>
				{/if}
			</div>

			<!-- Title Search -->
			<div class="flex flex-col gap-2">
				<Label for="title-search">Title Search</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="title-search"
						placeholder="Type here"
						bind:value={notificationsState.filters.titleSearch}
					/>
					{#if notificationsState.filters.titleSearch}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.titleSearch = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<!-- Content Search -->
			<div class="flex flex-col gap-2">
				<Label for="content-search">Content Search</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="content-search"
						placeholder="Type here"
						bind:value={notificationsState.filters.searchText}
					/>
					{#if notificationsState.filters.searchText}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.searchText = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<!-- Style -->
			<div class="flex flex-col gap-2">
				<Label for="style">Style</Label>
				<Select.Root
					type="single"
					value={notificationsState.filters.style ?? ''}
					onValueChange={(v) => {
						notificationsState.filters.style = v === '' ? undefined : v;
					}}
				>
					<Select.Trigger id="style" class="w-full">
						{notificationsState.filters.style
							? (styleOptions.find((o) => o.value === notificationsState.filters.style)?.label ??
								'Select style...')
							: 'Select style...'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each styleOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Category -->
			<div class="flex flex-col gap-2">
				<Label for="category">Category</Label>
				<Select.Root
					type="single"
					value={notificationsState.filters.category ?? ''}
					onValueChange={(v) => {
						notificationsState.filters.category = v === '' ? undefined : v;
					}}
				>
					<Select.Trigger id="category" class="w-full">
						{notificationsState.filters.category
							? (categoryOptions.find((o) => o.value === notificationsState.filters.category)
									?.label ?? 'Select category...')
							: 'Select category...'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each categoryOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Is Ongoing -->
			<div class="flex flex-col gap-2">
				<Label for="is-ongoing">Is Ongoing (Non-dismissible)</Label>
				<Select.Root
					type="single"
					value={getBooleanSelectValue(notificationsState.filters.isOngoing) ?? ''}
					onValueChange={(v) => {
						setBooleanFilter(v === '' ? undefined : v, 'isOngoing');
					}}
				>
					<Select.Trigger id="is-ongoing" class="w-full">
						{notificationsState.filters.isOngoing !== undefined
							? notificationsState.filters.isOngoing
								? 'Yes'
								: 'No'
							: 'Any'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">Any</Select.Item>
						{#each booleanOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Is Group Summary -->
			<div class="flex flex-col gap-2">
				<Label for="is-group-summary">Is Group Summary</Label>
				<Select.Root
					type="single"
					value={getBooleanSelectValue(notificationsState.filters.isGroupSummary) ?? ''}
					onValueChange={(v) => {
						setBooleanFilter(v === '' ? undefined : v, 'isGroupSummary');
					}}
				>
					<Select.Trigger id="is-group-summary" class="w-full">
						{notificationsState.filters.isGroupSummary !== undefined
							? notificationsState.filters.isGroupSummary
								? 'Yes'
								: 'No'
							: 'Any'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">Any</Select.Item>
						{#each booleanOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Package Name -->
			<div class="col-span-full flex flex-col gap-2">
				<Label for="package-name">Package Name</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="package-name"
						placeholder="com.example.app"
						bind:value={notificationsState.filters.packageName}
					/>
					{#if notificationsState.filters.packageName}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.packageName = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<!-- Channel ID -->
			<div class="col-span-full flex flex-col gap-2">
				<Label for="channel-id">Channel ID</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="channel-id"
						placeholder="Notification channel ID"
						bind:value={notificationsState.filters.channelId}
					/>
					{#if notificationsState.filters.channelId}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.channelId = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<!-- After Timestamp -->
			<div class="flex flex-col gap-2">
				<Label for="after-timestamp">After Date</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="after-timestamp"
						type="datetime-local"
						value={notificationsState.filters.afterTimestamp
							? new Date(notificationsState.filters.afterTimestamp).toISOString().slice(0, 16)
							: ''}
						oninput={(e) => {
							const value = e.currentTarget.value;
							notificationsState.filters.afterTimestamp = value
								? new Date(value).getTime()
								: undefined;
						}}
					/>
					{#if notificationsState.filters.afterTimestamp}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.afterTimestamp = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<!-- Before Timestamp -->
			<div class="flex flex-col gap-2">
				<Label for="before-timestamp">Before Date</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="before-timestamp"
						type="datetime-local"
						value={notificationsState.filters.beforeTimestamp
							? new Date(notificationsState.filters.beforeTimestamp).toISOString().slice(0, 16)
							: ''}
						oninput={(e) => {
							const value = e.currentTarget.value;
							notificationsState.filters.beforeTimestamp = value
								? new Date(value).getTime()
								: undefined;
						}}
					/>
					{#if notificationsState.filters.beforeTimestamp}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.beforeTimestamp = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>
		</div>

		<Sheet.Footer class="flex flex-col gap-2 sm:flex-row">
			<Button variant="outline" onclick={handleClearFilters} class="w-full sm:w-auto">
				Clear All
			</Button>
			<Button onclick={handleApplyFilters} class="w-full sm:w-auto">Apply Filters</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
