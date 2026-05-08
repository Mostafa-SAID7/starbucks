# 🔐 Security Policy

## Security Practices

### 1. Static Analysis
The project uses **GitHub CodeQL** to automatically scan for vulnerabilities (SQL injection, XSS, etc.) on every push and pull request.

### 2. Dependency Audits
- **npm audit:** Integrated into the CI pipeline to block builds with high-severity vulnerabilities.
- **Dependabot:** Automated weekly updates for all dependencies to ensure the latest security patches are applied.

### 3. Data Safety
- All user inputs are sanitized.
- Security headers are configured in the Nginx production container.

### 4. Code Reviews
All changes undergo mandatory peer review with a focus on:
- Secure data handling.
- Proper authentication flow.
- Absence of hardcoded secrets.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

Please include the following in your report:
- Type of issue (e.g., XSS, CSRF, etc.).
- Steps to reproduce the issue.
- Potential impact.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.1.x   | ✅ Yes    |
| 2.0.x   | ❌ No     |
| < 2.0   | ❌ No     |
