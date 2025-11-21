import { goto } from '$app/navigation';
import { page } from '$app/state';
import { Capacitor } from '@capacitor/core';
import {
	NotificationCategory,
	NotificationReader,
	NotificationStyle,
	type NotificationItem
} from 'capacitor-notification-reader';
import { untrack } from 'svelte';
import { LoaderState } from 'svelte-infinite';

export const LOAD_LIMIT = 50;
export type NotificationFilters = {
	apps?: string[];
	searchText?: string;
	titleSearch?: string;
	packageName?: string;
	category?: NotificationCategory | string;
	style?: NotificationStyle | string;
	isOngoing?: boolean;
	isGroupSummary?: boolean;
	channelId?: string;
	beforeTimestamp?: number;
	afterTimestamp?: number;
};

class NotificationsState {
	notifications = $state<NotificationItem[]>();
	loaderState = new LoaderState();
	filters: NotificationFilters = $state({});

	constructor() {
		if (!Capacitor.isNativePlatform()) {
			return;
		}

		// Initialize filters from URL params
		this.loadFiltersFromUrl();

		this.loadInitial();

		NotificationReader.addListener(
			'notificationPosted',
			(info: NotificationItem) => (this.notifications = [info, ...(this.notifications ?? [])])
		);
	}

	loadFiltersFromUrl = () => {
		const params = page.url.searchParams;

		this.filters = {
			apps: params.get('apps')?.split(',').filter(Boolean),
			searchText: params.get('search') || undefined,
			titleSearch: params.get('titleSearch') || undefined,
			packageName: params.get('packageName') || undefined,
			category: params.get('category') || undefined,
			style: params.get('style') || undefined,
			isOngoing:
				params.get('isOngoing') === 'true'
					? true
					: params.get('isOngoing') === 'false'
						? false
						: undefined,
			isGroupSummary:
				params.get('isGroupSummary') === 'true'
					? true
					: params.get('isGroupSummary') === 'false'
						? false
						: undefined,
			channelId: params.get('channelId') || undefined,
			beforeTimestamp: params.get('beforeTimestamp') ? Number(params.get('beforeTimestamp')) : undefined,
			afterTimestamp: params.get('afterTimestamp') ? Number(params.get('afterTimestamp')) : undefined
		};
	};

	loadInitial = async () => {
		try {
			const res = await NotificationReader.getNotifications({
				limit: LOAD_LIMIT,
				filter: untrack(() => this.buildFilterObject())
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
				filter: this.buildFilterObject()
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

	buildFilterObject = () => {
		const filter: any = {};

		if (this.filters.searchText) {
			filter.textContainsInsensitive = this.filters.searchText;
		}
		if (this.filters.titleSearch) {
			filter.titleContainsInsensitive = this.filters.titleSearch;
		}
		if (this.filters.apps && this.filters.apps.length > 0) {
			filter.appNames = this.filters.apps;
		}
		if (this.filters.packageName) {
			filter.packageName = this.filters.packageName;
		}
		if (this.filters.category) {
			filter.category = this.filters.category;
		}
		if (this.filters.style) {
			filter.style = this.filters.style;
		}
		if (this.filters.isOngoing !== undefined) {
			filter.isOngoing = this.filters.isOngoing;
		}
		if (this.filters.isGroupSummary !== undefined) {
			filter.isGroupSummary = this.filters.isGroupSummary;
		}
		if (this.filters.channelId) {
			filter.channelId = this.filters.channelId;
		}
		if (this.filters.beforeTimestamp) {
			filter.beforeTimestamp = this.filters.beforeTimestamp;
		}
		if (this.filters.afterTimestamp) {
			filter.afterTimestamp = this.filters.afterTimestamp;
		}

		return filter;
	};

	applyFilters = () => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams();

		if (this.filters.apps && this.filters.apps.length > 0) {
			params.set('apps', this.filters.apps.join(','));
		}

		if (this.filters.searchText && this.filters.searchText.trim() !== '') {
			params.set('search', this.filters.searchText.trim());
		}

		if (this.filters.titleSearch && this.filters.titleSearch.trim() !== '') {
			params.set('titleSearch', this.filters.titleSearch.trim());
		}

		if (this.filters.packageName && this.filters.packageName.trim() !== '') {
			params.set('packageName', this.filters.packageName.trim());
		}

		if (this.filters.category) {
			params.set('category', this.filters.category);
		}

		if (this.filters.style) {
			params.set('style', this.filters.style);
		}

		if (this.filters.isOngoing !== undefined) {
			params.set('isOngoing', this.filters.isOngoing.toString());
		}

		if (this.filters.isGroupSummary !== undefined) {
			params.set('isGroupSummary', this.filters.isGroupSummary.toString());
		}

		if (this.filters.channelId && this.filters.channelId.trim() !== '') {
			params.set('channelId', this.filters.channelId.trim());
		}

		if (this.filters.beforeTimestamp) {
			params.set('beforeTimestamp', this.filters.beforeTimestamp.toString());
		}

		if (this.filters.afterTimestamp) {
			params.set('afterTimestamp', this.filters.afterTimestamp.toString());
		}

		const queryString = params.toString();
		goto(queryString ? `/?${queryString}` : '/');
	};

	clearFilters = () => {
		this.filters = {};
		goto('/');
	};
}

export const notificationsState = new NotificationsState();
