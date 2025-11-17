# Notice

A clean, open-source notification history management app for Android.

## Overview

Notice is a simple and privacy-focused Android application that helps you manage and view your notification history. Built with transparency and user privacy in mind, Notice contains **no ads, no analytics, and no tracking** of any kind. The app doesn't even connect to the internet!

## Features

- 📱 Clean, intuitive notification history viewer
- 🔒 Completely offline - no internet connection required
- 🔓 100% open source and transparent
- 🚫 No ads, no tracking, no analytics
- 🎨 Built with modern web technologies (SvelteKit + Capacitor)

## Why Notice?

Existing notification management solutions are often filled with ads or don't work properly. Notice was created to provide a simple, reliable, and privacy-respecting alternative. Since notifications contain personal data, the app is completely open source so you can verify exactly how it works.

## Tech Stack

- **Framework**: SvelteKit 2
- **UI Components**: Tailwind CSS, bits-ui
- **Mobile**: Capacitor 7
- **Language**: TypeScript
- **Build Tool**: Vite

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (preferred package manager)
- Android Studio (for Android development)

### Getting Started

1. Clone the repository:
```sh
git clone https://github.com/whyash5114/notice.git
cd notice
```

2. Install dependencies:
```sh
pnpm install
```

3. Start the development server:
```sh
pnpm dev
```

4. Open the app in your browser or run on Android:
```sh
# Sync with Capacitor
pnpm prepare

# Open in Android Studio
npx cap open android
```

### Building

To create a production build:

```sh
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support the Project

If you find Notice useful, consider supporting its development:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/whyash5114)
- ❤️ [Sponsor on GitHub](https://github.com/sponsors/whyash5114)
- ⭐ [Star on GitHub](https://github.com/whyash5114/notice)
- 📱 [Rate on Play Store](https://play.google.com/store/apps/details?id=com.notice.app)

Your support helps keep this project maintained and improved!

## Privacy

Notice respects your privacy:
- No internet connection required
- No data collection or analytics
- No third-party tracking
- Your notifications stay on your device

*Note: Optional cloud syncing/backup features may be added in the future, but will always be opt-in.*

## License

This project is open source. See the repository for license details.

## Acknowledgments

Built with modern web technologies and a focus on user privacy and transparency.
