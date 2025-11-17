import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.whyash5114.notice',
	appName: 'notice',
	webDir: 'build',
	server: {
		url: 'http://localhost:5173',
		cleartext: true
	},
	plugins: {
		StatusBar: {
			overlaysWebView: false
		}
	}
};

export default config;
