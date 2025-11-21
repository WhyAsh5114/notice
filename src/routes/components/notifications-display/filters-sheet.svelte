<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { FunnelPlusIcon, XIcon } from '@lucide/svelte';
	import { NotificationCategory, NotificationStyle } from 'capacitor-notification-reader';
	import { notificationsState } from '../notifications-state.svelte';

	let open = $state(false);

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
				<Label for="app-names">App Names (comma-separated)</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="app-names"
						placeholder="WhatsApp, Gmail, Slack"
						value={notificationsState.filters.apps?.join(', ') ?? ''}
						oninput={(e) => {
							const value = e.currentTarget.value.trim();
							notificationsState.filters.apps = value
								? value
										.split(',')
										.map((app) => app.trim())
										.filter(Boolean)
								: undefined;
						}}
					/>
					{#if notificationsState.filters.apps && notificationsState.filters.apps.length > 0}
						<InputGroup.Addon>
							<button
								onclick={() => (notificationsState.filters.apps = undefined)}
								class="text-muted-foreground hover:text-foreground"
								type="button"
							>
								<XIcon class="h-4 w-4" />
							</button>
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
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
						{#each styleOptions as option}
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
						{#each categoryOptions as option}
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
						{#each booleanOptions as option}
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
						{#each booleanOptions as option}
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
