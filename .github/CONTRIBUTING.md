# Contributing to Notice

First off, thank you for considering contributing to Notice! 🎉

Notice is a privacy-focused notification history app, and we're excited to have you help make it better. This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Privacy Guidelines](#privacy-guidelines)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to maintain a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```sh
   git clone https://github.com/YOUR_USERNAME/notice.git
   cd notice
   ```
3. **Add the upstream remote**:
   ```sh
   git remote add upstream https://github.com/whyash5114/notice.git
   ```

## Development Setup

### Prerequisites

- Node.js v18 or higher
- pnpm (preferred package manager)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
   ```sh
   pnpm install
   ```

2. Start the development server:
   ```sh
   pnpm dev
   ```

3. For Android development:
   ```sh
   # Build and sync with Capacitor
   pnpm build
   pnpm prepare
   
   # Open in Android Studio
   npx cap open android
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint and Prettier checks |
| `pnpm format` | Format code with Prettier |

## How to Contribute

### Reporting Bugs

- Use the [bug report template](https://github.com/whyash5114/notice/issues/new?template=bug_report.yml)
- Include your Android version, device model, and app version
- Provide clear steps to reproduce the issue
- Include screenshots if applicable

### Suggesting Features

- Use the [feature request template](https://github.com/whyash5114/notice/issues/new?template=feature_request.yml)
- Explain the problem your feature would solve
- Consider the privacy implications of your suggestion

### Submitting Code

1. Create a new branch for your feature/fix:
   ```sh
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and commit them (see [Commit Messages](#commit-messages))

3. Push to your fork:
   ```sh
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request against the `main` branch

## Privacy Guidelines

**This is critical.** Notice is built on a foundation of privacy and transparency. All contributions must adhere to these principles:

### ✅ DO

- Keep all data processing on-device
- Use Capacitor APIs that don't require network access
- Document any permissions your feature requires
- Consider the minimal data needed for functionality

### ❌ DON'T

- Add any analytics, tracking, or telemetry
- Make network requests (unless for explicitly opt-in future features)
- Include third-party SDKs that collect data
- Store user data outside the device
- Add dependencies that phone home

If your feature requires network access, it must be:
1. Clearly opt-in
2. Documented in the PR
3. Discussed with maintainers first

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types; use proper typing
- Use interfaces for object shapes

### Svelte

- Follow Svelte 5 best practices
- Use runes ($state, $derived, $effect) appropriately
- Keep components focused and reusable

### Styling

- Use Tailwind CSS for styling
- Follow the existing design patterns
- Ensure accessibility (proper contrast, focus states, etc.)

### Code Quality

Before submitting, ensure:

```sh
# No type errors
pnpm check

# No lint errors
pnpm lint

# Code is formatted
pnpm format
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

### Examples

```
feat(notifications): add search functionality

fix(ui): correct dark mode colors on settings page

docs: update contributing guidelines

chore(deps): update svelte to v5.45
```

## Pull Request Process

1. **Ensure your PR**:
   - Has a clear title and description
   - References any related issues
   - Passes all CI checks
   - Has been tested on Android

2. **Review Process**:
   - A maintainer will review your PR
   - Address any requested changes
   - Once approved, a maintainer will merge it

3. **After Merge**:
   - Delete your branch
   - Sync your fork with upstream

## Questions?

Feel free to:
- Open a [Discussion](https://github.com/whyash5114/notice/discussions)
- Ask questions in your PR or issue

Thank you for contributing to Notice! 🙏
