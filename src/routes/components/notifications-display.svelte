<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { BellDotIcon, FunnelIcon, FunnelPlusIcon } from '@lucide/svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { type NotificationItem, NotificationReader } from 'capacitor-notification-reader';
	import { InfiniteLoader, LoaderState } from 'svelte-infinite';
	import FiltersSheet from './filters-sheet.svelte';

	const LOAD_LIMIT = 50;
	const loaderState = new LoaderState();
	let notifications = $state<NotificationItem[]>();

	$effect(() => {
		NotificationReader.getNotifications({ limit: LOAD_LIMIT }).then((res) => {
			notifications = res.notifications;
			loaderState.loaded();
		});
	});

	$effect(() => {
		const listener = NotificationReader.addListener(
			'notificationPosted',
			(info: NotificationItem) => (notifications = [info, ...(notifications ?? [])])
		);

		return async () => {
			(await listener).remove();
		};
	});

	const loadMore = async () => {
		try {
			if (!notifications || notifications.length === 0) {
				loaderState.complete();
				return;
			}

			// Use the timestamp of the last notification as the cursor
			const cursor = notifications[notifications.length - 1].timestamp;
			const res = await NotificationReader.getNotifications({ cursor, limit: LOAD_LIMIT });

			if (res.notifications.length === 0) {
				loaderState.complete();
			} else {
				notifications.push(...res.notifications);
				loaderState.loaded();
			}
		} catch (error) {
			console.error('Error loading more notifications:', error);
			loaderState.error();
		}
	};

	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	}

	function isPreviousNotificationDifferentDate(idx: number): boolean {
		if (!notifications) return false;
		if (idx === 0) return true;

		const currentDate = new Date(notifications[idx].timestamp).toDateString();
		const previousDate = new Date(notifications[idx - 1].timestamp).toDateString();
		return currentDate !== previousDate;
	}
</script>

{#if notifications === undefined}
	<Empty.Root class="w-full">
		<Empty.Header>
			<Empty.Media variant="icon">
				<Spinner />
			</Empty.Media>
			<Empty.Title>Loading notifications</Empty.Title>
			<Empty.Description>Please wait while we load your notifications</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else if notifications.length === 0}
	<Empty.Root class="w-full">
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
{:else}
	<div class="flex gap-1">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Search..." />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup.Root>
		<FiltersSheet />
		<Button size="icon" title="Apply filter">
			<FunnelIcon />
		</Button>
	</div>
	<ScrollArea class="h-px w-full grow">
		<InfiniteLoader {loaderState} triggerLoad={loadMore}>
			<div class="flex flex-col gap-2 p-2">
				{#each notifications as notification, index (index)}
					{#if isPreviousNotificationDifferentDate(index)}
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
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			{#snippet loading()}
				<div class="flex items-center justify-center p-4">
					<Spinner />
					<span class="ml-2 text-sm text-muted-foreground">Loading more notifications...</span>
				</div>
			{/snippet}

			{#snippet noData()}
				<div class="p-4 text-center text-sm text-muted-foreground">
					No more notifications to load
				</div>
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
{/if}
