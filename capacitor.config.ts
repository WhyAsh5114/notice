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
	// * For development purposes only
	// server: {
	// 	url: 'http://localhost:5173',
	// 	cleartext: true
	// }
};

export default config;
