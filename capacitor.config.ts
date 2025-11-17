import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.whyash5114.notice',
	appName: 'Notice',
	webDir: 'build',
	plugins: {
		StatusBar: {
			overlaysWebView: false
		}
	}
};

export default config;
