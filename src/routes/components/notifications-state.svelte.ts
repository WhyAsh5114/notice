import { Capacitor } from '@capacitor/core';
import { NotificationReader, type NotificationItem } from 'capacitor-notification-reader';
import { LoaderState } from 'svelte-infinite';

export const LOAD_LIMIT = 50;

class NotificationsState {
	notifications = $state<NotificationItem[]>();
	loaderState = new LoaderState();

	constructor() {
		if (!Capacitor.isNativePlatform()) {
			return;
		}

		NotificationReader.getNotifications({ limit: LOAD_LIMIT }).then((res) => {
			this.notifications = res.notifications;
			this.loaderState.loaded();
		});

		NotificationReader.addListener(
			'notificationPosted',
			(info: NotificationItem) => (this.notifications = [info, ...(this.notifications ?? [])])
		);
	}

	loadMore = async () => {
		try {
			if (!this.notifications || this.notifications.length === 0) {
				this.loaderState.complete();
				return;
			}

			// Use the timestamp of the last notification as the cursor
			const cursor = this.notifications[this.notifications.length - 1].timestamp;
			const res = await NotificationReader.getNotifications({ cursor, limit: LOAD_LIMIT });

			if (res.notifications.length === 0) {
				this.loaderState.complete();
			} else {
				this.notifications.push(...res.notifications);
				this.loaderState.loaded();
			}
		} catch (error) {
			console.error('Error loading more notifications:', error);
			this.loaderState.error();
		}
	};
}

export const notificationsState = new NotificationsState();
