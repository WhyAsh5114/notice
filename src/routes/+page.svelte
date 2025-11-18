<script lang="ts">
	import { NotificationReader } from 'capacitor-notification-reader';
	import CheckingPermissions from './components/permissions/checking-permissions.svelte';
	import NotificationsDisplay from './components/notifications-display/notifications-display.svelte';
	import RequestPermissions from './components/permissions/request-permissions.svelte';

	let permissionGranted = $state<boolean>();

	$effect(() => {
		NotificationReader.isAccessEnabled().then(({ enabled }) => {
			permissionGranted = enabled;
		});
	});
</script>

{#if permissionGranted === undefined}
	<CheckingPermissions />
{:else if permissionGranted === false}
	<RequestPermissions bind:permissionGranted />
{:else}
	<NotificationsDisplay />
{/if}
