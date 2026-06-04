<div align="center">

# 🔒 Security Policy

**This policy defines the security standards and reporting procedures for the Starbucks Egypt enterprise application.**

</div>

---

## 🛡️ Security Practices

We take the security of our users and data seriously. Our infrastructure includes multiple layers of protection:

### 1. Automated Security Scanning
- **CodeQL Analysis**: Continuous static analysis on every push to identify common vulnerabilities (XSS, SQLi, etc.).
- **Dependency Audits**: Automated `npm audit` and `dotnet list package --vulnerable` checks integrated into the CI/CD pipeline.
- **Dependabot**: Proactive dependency management and automated security patching.

### 2. Application Security
- **Authentication**: JWT-based authentication with high-entropy secrets and secure token rotation.
- **Validation**: Strict input validation using **FluentValidation** (Backend) and **Zod** (Frontend).
- **Sanitization**: All user-generated content is sanitized before storage and rendering to prevent injection attacks.
- **Rate Limiting**: IP-based rate limiting on sensitive endpoints (Login, Register).

### 3. Infrastructure Security
- **Secure Headers**: Nginx is configured with strict Content Security Policy (CSP), HSTS, and XSS protection headers.
- **CORS Policy**: Strictly defined allowed origins for production environments.
- **Environment Management**: No secrets are stored in the codebase; all sensitive data is managed via environment variables and GitHub Secrets.

---

## 🐛 Reporting a Vulnerability

If you believe you have found a security vulnerability, please report it immediately.

**Email**: [security@starbucks.eg](mailto:security@starbucks.eg)

Please include:
1. **Description**: A detailed description of the vulnerability.
2. **Steps to Reproduce**: A clear set of steps to reproduce the issue.
3. **Proof of Concept**: Any scripts or screenshots that demonstrate the vulnerability.
4. **Impact**: Your assessment of the potential impact on users or the system.

---

## ✅ Supported Versions

| Version | Status |
| :--- | :--- |
| **2.3.x (Current)** | ✅ Supported |
| **2.x.x** | ❌ Limited Support |
| **1.x.x** | ❌ Deprecated |

---
*Thank you for helping us keep the Starbucks Egypt community safe.*
