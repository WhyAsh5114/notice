<script lang="ts">
	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { formatTimestamp, isPreviousNotificationDifferentDate } from '$lib/my-utils';
	import { FunnelIcon } from '@lucide/svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { NotificationStyle } from 'capacitor-notification-reader';
	import { InfiniteLoader } from 'svelte-infinite';
	import { notificationsState } from '../notifications-state.svelte';
	import FiltersSheet from './filters-sheet.svelte';
	import LoadingNotifications from './loading-notifications.svelte';
	import NoNotifications from './no-notifications.svelte';

	function comparePreviousDate(index: number) {
		if (!notificationsState.notifications) return false;
		if (index === 0) return true;

		return isPreviousNotificationDifferentDate(
			notificationsState.notifications[index - 1],
			notificationsState.notifications[index]
		);
	}

	$effect(() => {
		page.url.searchParams;
		notificationsState.notifications = undefined;
		notificationsState.loaderState.reset();
		notificationsState.loadInitial();
	});
</script>

<div class="flex gap-1">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Search..." bind:value={notificationsState.filters.searchText} />
		<InputGroup.Addon>
			<SearchIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
	<FiltersSheet />
	<Button size="icon" title="Apply filter" onclick={notificationsState.applyFilters}>
		<FunnelIcon />
	</Button>
</div>
<ScrollArea class="h-px w-full grow">
	<InfiniteLoader
		loaderState={notificationsState.loaderState}
		triggerLoad={notificationsState.loadMore}
	>
		<div class="flex flex-col gap-2 p-2">
			{#each notificationsState.notifications as notification, index (index)}
				{#if comparePreviousDate(index)}
					<div class="py-1 text-lg font-medium">
						{new Date(notification.timestamp).toLocaleDateString(undefined, {
							dateStyle: 'long'
						})}
					</div>
				{/if}
				<Card.Root class="gap-2">
					<Card.Header class="flex flex-row items-start gap-3">
						<Avatar.Root class="rounded-md">
							<Avatar.Image src={`data:image/png;base64,${notification.appIcon}`} />
							<Avatar.Fallback>{notification.appName.charAt(0)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<Card.Title>{notification.appName}</Card.Title>
							<Card.Description>{formatTimestamp(notification.timestamp)}</Card.Description>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">{notification.title}</p>
						<p class="text-xs">{notification.text}</p>
						{#if notification.style === NotificationStyle.BIG_PICTURE}
							<img
								src={`data:image/png;base64,${notification.bigPicture}`}
								alt="Notification media"
								class="mt-2"
							/>
						{/if}
					</Card.Content>
				</Card.Root>
			{:else}
				{#if notificationsState.notifications === undefined}
					<LoadingNotifications />
				{:else}
					<NoNotifications />
				{/if}
			{/each}
		</div>

		{#snippet loading()}
			<div class="flex items-center justify-center p-4">
				<Spinner />
				<span class="ml-2 text-sm text-muted-foreground">Loading more notifications...</span>
			</div>
		{/snippet}

		{#snippet noData()}
			{#if notificationsState.notifications !== undefined && notificationsState.notifications.length > 0}
				<div class="p-4 text-center text-sm text-muted-foreground">
					No more notifications to load
				</div>
			{/if}
		{/snippet}

		{#snippet error(load)}
			<div class="flex flex-col items-center gap-2 p-4">
				<p class="text-sm text-destructive">Error loading notifications</p>
				<button
					onclick={load}
					class="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
				>
					Retry
				</button>
			</div>
		{/snippet}

		{#snippet coolingOff()}
			<div class="p-4 text-center text-sm text-muted-foreground">
				A potential loop has been detected. Please try again.
			</div>
		{/snippet}
	</InfiniteLoader>
</ScrollArea>
