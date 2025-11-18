import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { type NotificationItem, NotificationReader } from 'capacitor-notification-reader';
import { formatHex } from 'culori';
import { toast } from 'svelte-sonner';

export function oklchToHex(oklchString: string): string {
	const cleaned = oklchString.replace(/oklch\(|\)/g, '').trim();
	const [l, c, h] = cleaned.split(/\s+/).map((val, index) => {
		const num = parseFloat(val);
		if (index === 0) return Math.max(0, Math.min(1, num)); // lightness
		if (index === 1) return Math.max(0, Math.min(0.4, num)); // chroma
		if (index === 2) return num % 360; // hue
		return num;
	});

	const oklchColor = { mode: 'oklch' as const, l, c, h: h || 0 };
	return formatHex(oklchColor) || '#000000';
}

function notificationToCSVRow(notification: NotificationItem): string {
	const escape = (str: string | undefined) => {
		if (!str) return '';
		return `"${str.replace(/"/g, '""')}"`;
	};

	return [
		escape(notification.id),
		escape(notification.appName),
		escape(notification.packageName),
		escape(notification.title),
		escape(notification.text),
		notification.timestamp.toString(),
		escape(notification.category),
		escape(notification.style),
		escape(notification.subText),
		escape(notification.infoText),
		escape(notification.summaryText),
		escape(notification.group),
		notification.isGroupSummary.toString(),
		escape(notification.channelId),
		notification.isOngoing.toString(),
		notification.autoCancel.toString(),
		notification.isLocalOnly.toString(),
		notification.priority.toString(),
		notification.number.toString()
	].join(',');
}

export async function exportNotifications(): Promise<void> {
	try {
		// Fetch all notifications
		const allNotifications: NotificationItem[] = [];
		let cursor: number | undefined;
		let hasMore = true;

		while (hasMore) {
			const result = await NotificationReader.getNotifications({
				cursor,
				limit: 100
			});

			if (result.notifications.length === 0) {
				hasMore = false;
			} else {
				allNotifications.push(...result.notifications);
				cursor = result.notifications[result.notifications.length - 1].timestamp;
			}
		}

		if (allNotifications.length === 0) {
			toast.info('No notifications to export');
			return;
		}

		// Create CSV content
		const headers = [
			'id',
			'appName',
			'packageName',
			'title',
			'text',
			'timestamp',
			'category',
			'style',
			'subText',
			'infoText',
			'summaryText',
			'group',
			'isGroupSummary',
			'channelId',
			'isOngoing',
			'autoCancel',
			'isLocalOnly',
			'priority',
			'number'
		].join(',');

		const csvContent = [headers, ...allNotifications.map(notificationToCSVRow)].join('\n');

		// Save to file
		const fileName = `notifications_export_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;

		await Filesystem.writeFile({
			path: fileName,
			data: csvContent,
			directory: Directory.Documents,
			encoding: Encoding.UTF8
		});

		toast.success(`Exported ${allNotifications.length} notifications`, {
			description: `Documents/${fileName}`
		});
	} catch (error) {
		toast.error('Failed to export notifications');
		console.error(error);
		throw error;
	}
}

function parseCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		const nextChar = line[i + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				current += '"';
				i++; // Skip next quote
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += char;
		}
	}
	result.push(current);

	return result;
}

export async function importNotifications(): Promise<void> {
	try {
		// Read file - using a file input approach since Filesystem doesn't have a picker
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv';

		const filePromise = new Promise<File>((resolve, reject) => {
			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) resolve(file);
				else reject(new Error('No file selected'));
			};
			input.oncancel = () => reject(new Error('File selection cancelled'));
		});

		input.click();
		const file = await filePromise;

		// Read file content
		const content = await file.text();
		const lines = content.split('\n').filter((line) => line.trim());

		if (lines.length < 2) {
			toast.error('Invalid CSV file');
			return;
		}

		// Skip header, parse rows
		const notifications: NotificationItem[] = [];
		for (let i = 1; i < lines.length; i++) {
			try {
				const values = parseCSVLine(lines[i]);
				if (values.length >= 19) {
					const notification: NotificationItem = {
						id: values[0],
						appName: values[1],
						packageName: values[2],
						title: values[3] || undefined,
						text: values[4] || undefined,
						timestamp: parseInt(values[5]),
						category: values[6] || undefined,
						style: values[7] as any,
						subText: values[8] || undefined,
						infoText: values[9] || undefined,
						summaryText: values[10] || undefined,
						group: values[11] || undefined,
						isGroupSummary: values[12] === 'true',
						channelId: values[13] || undefined,
						actions: [],
						isOngoing: values[14] === 'true',
						autoCancel: values[15] === 'true',
						isLocalOnly: values[16] === 'true',
						priority: parseInt(values[17]),
						number: parseInt(values[18])
					} as NotificationItem;

					notifications.push(notification);
				}
			} catch (error) {
				console.error(`Error parsing line ${i}:`, error);
			}
		}

		if (notifications.length === 0) {
			toast.error('No valid notifications found in file');
			return;
		}

		// Import notifications
		await NotificationReader.importNotifications({ notifications });
		toast.success(`Imported ${notifications.length} notifications`);
	} catch (error: any) {
		if (error.message !== 'File selection cancelled') {
			toast.error('Failed to import notifications');
			console.error(error);
			throw error;
		}
	}
}

export async function deleteAllNotifications(): Promise<void> {
	try {
		await NotificationReader.deleteAllNotifications();
		toast.success('All notifications deleted');
	} catch (error) {
		toast.error('Failed to delete notifications');
		console.error(error);
		throw error;
	}
}

export function formatTimestamp(timestamp: number): string {
	const date = new Date(timestamp);
	return date.toLocaleTimeString();
}

export function isPreviousNotificationDifferentDate(
	previousNotification: NotificationItem,
	currentNotification: NotificationItem
): boolean {
	const currentDate = new Date(currentNotification.timestamp).toDateString();
	const previousDate = new Date(previousNotification.timestamp).toDateString();
	return currentDate !== previousDate;
}
