<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { type NotificationItem, NotificationReader } from 'capacitor-notification-reader';

	let activeNotifications = $state<NotificationItem[]>();

	$effect(() => {
		NotificationReader.getActiveNotifications().then(({ notifications }) => {
			activeNotifications = notifications;
		});
	});
</script>

{#if activeNotifications === undefined}
	<Empty.Root class="w-full">
		<Empty.Header>
			<Empty.Media variant="icon">
				<Spinner />
			</Empty.Media>
			<Empty.Title>Loading notifications</Empty.Title>
			<Empty.Description>Please wait while we load your notifications</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else if activeNotifications.length === 0}
	<Empty.Root class="w-full">
		<Empty.Header>
			<Empty.Media variant="icon">
				<Spinner />
			</Empty.Media>
			<Empty.Title>No notifications yet</Empty.Title>
			<Empty.Description>
				The app has started recording notifications but there are no notifications to display yet
			</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else}
	<ScrollArea class="h-full">
		<Item.Group>
			{#each activeNotifications as notification, index (index)}
				<Item.Root>
					<Item.Media>
						<Avatar.Root>
							<Avatar.Image
								src={`data:image/png;base64,${notification.largeIcon ?? notification.smallIcon ?? notification.appIcon}`}
							/>
							<Avatar.Fallback>{notification.app.charAt(0)}</Avatar.Fallback>
						</Avatar.Root>
					</Item.Media>
					<Item.Content class="gap-1">
						<Item.Title>{notification.title}</Item.Title>
						<Item.Description>{notification.text}</Item.Description>
					</Item.Content>
				</Item.Root>
			{/each}
		</Item.Group>
	</ScrollArea>
{/if}
