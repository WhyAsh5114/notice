<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { BellDotIcon } from '@lucide/svelte';
	import { type NotificationItem, NotificationReader } from 'capacitor-notification-reader';

	let notifications = $state<NotificationItem[]>();

	$effect(() => {
		NotificationReader.getNotifications().then((res) => {
			notifications = res.notifications;
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

	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleString();
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
	<ScrollArea class="h-px grow w-full">
		<div class="flex flex-col gap-2 p-2">
			{#each notifications.toReversed() as notification, index (index)}
				<Card.Root class="gap-2">
					<Card.Header class="flex flex-row items-start gap-3">
						<Avatar.Root class="bg-muted p-2">
							<Avatar.Image
								src={`data:image/png;base64,${notification.largeIcon ?? notification.smallIcon ?? notification.appIcon}`}
							/>
							<Avatar.Fallback>{notification.app.charAt(0)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<Card.Title>{notification.app}</Card.Title>
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
	</ScrollArea>
{/if}
