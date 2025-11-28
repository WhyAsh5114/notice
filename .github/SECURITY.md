# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest| :x:                |

We recommend always using the latest version of Notice from the [Google Play Store](https://play.google.com/store/apps/details?id=com.whyash5114.notice) or building from the latest source.

## Reporting a Vulnerability

We take security seriously at Notice. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the repository owner or through GitHub's private vulnerability reporting feature:

1. Go to the [Security tab](https://github.com/whyash5114/notice/security) of this repository
2. Click "Report a vulnerability"
3. Fill out the form with details about the vulnerability

### What to Include

Please include the following information:

- Type of vulnerability (e.g., data exposure, permission bypass, etc.)
- Full path of the affected source file(s)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on complexity)

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report
2. **Investigation**: We'll investigate and validate the issue
3. **Updates**: We'll keep you informed of our progress
4. **Fix**: We'll work on a fix and coordinate disclosure
5. **Credit**: With your permission, we'll credit you in the release notes

## Security Considerations

### Privacy by Design

Notice is built with privacy as a core principle:

- **No Network Access**: The app does not connect to the internet
- **On-Device Storage**: All data remains on your device
- **No Analytics**: No tracking, telemetry, or data collection
- **Open Source**: Full transparency through open source code

### Permissions

Notice requires the following Android permissions:

- **Notification Listener**: Required to read notification history
- **Storage** (optional): Only if you choose to export data

### Data Handling

- Notification data is processed and stored locally only
- No data is transmitted to external servers
- Users have full control over their data

## Security Best Practices for Contributors

If you're contributing to Notice:

1. **Never add network capabilities** without explicit approval
2. **Never add analytics or tracking** of any kind
3. **Review dependencies** for security issues before adding
4. **Follow secure coding practices**
5. **Keep dependencies updated** to patch known vulnerabilities

## Third-Party Dependencies

We regularly audit our dependencies for security vulnerabilities using:
- GitHub Dependabot alerts
- npm/pnpm audit

## Contact

For security concerns, you can also reach out through:
- [GitHub Security Advisories](https://github.com/whyash5114/notice/security/advisories)
- Opening a private security report on GitHub

Thank you for helping keep Notice secure! 🔒
