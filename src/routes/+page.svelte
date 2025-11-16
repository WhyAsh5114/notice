<script lang="ts">
	import { NotificationReader } from 'capacitor-notification-reader';
	import CheckingPermissions from './components/checking-permissions.svelte';
	import NotificationsDisplay from './components/notifications-display.svelte';
	import RequestPermissions from './components/request-permissions.svelte';

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
