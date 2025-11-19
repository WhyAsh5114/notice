import { goto } from '$app/navigation';
import { Capacitor } from '@capacitor/core';
import { NotificationReader, type NotificationItem } from 'capacitor-notification-reader';
import { LoaderState } from 'svelte-infinite';

export const LOAD_LIMIT = 50;
export type NotificationFilters = {
	apps?: string[];
	searchText?: string;
};

class NotificationsState {
	notifications = $state<NotificationItem[]>();
	loaderState = new LoaderState();
	filters: NotificationFilters = {};

	constructor() {
		if (!Capacitor.isNativePlatform()) {
			return;
		}

		this.loadInitial();

		NotificationReader.addListener(
			'notificationPosted',
			(info: NotificationItem) => (this.notifications = [info, ...(this.notifications ?? [])])
		);
	}

	loadInitial = async () => {
		try {
			const res = await NotificationReader.getNotifications({
				limit: LOAD_LIMIT,
				filter: {
					textContainsInsensitive: this.filters.searchText,
					appNames: this.filters.apps
				}
			});
			this.notifications = res.notifications;
			this.loaderState.loaded();
		} catch (error) {
			console.error('Error loading initial notifications:', error);
			this.loaderState.error();
		}
	};

	loadMore = async () => {
		try {
			if (!this.notifications || this.notifications.length === 0) {
				this.loaderState.complete();
				return;
			}

			// Use the timestamp of the last notification as the cursor
			const cursor = this.notifications[this.notifications.length - 1].timestamp;
			const res = await NotificationReader.getNotifications({
				cursor,
				limit: LOAD_LIMIT,
				filter: {
					textContainsInsensitive: this.filters.searchText,
					appNames: this.filters.apps
				}
			});

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

	applyFilters = () => {
		const url = new URL(window.location.href);
		const params = url.searchParams;

		if (this.filters.apps && this.filters.apps.length > 0) {
			params.set('apps', this.filters.apps.join(','));
		} else {
			params.delete('apps');
		}

		if (this.filters.searchText && this.filters.searchText.trim() !== '') {
			params.set('search', this.filters.searchText.trim());
		} else {
			params.delete('search');
		}

		goto(`/?${params.toString()}`);
	};
}

export const notificationsState = new NotificationsState();
