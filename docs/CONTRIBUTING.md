# 🤝 Contributing

Guidelines for contributing to the Starbucks Egypt React Clone.

## 🚀 Development Workflow

### 1. Branching Strategy
- `main`: Production-ready code (Protected).
- `develop`: Integration branch for new features.
- `feature/*`: New features or enhancements.
- `fix/*`: Bug fixes.

### 2. Standardized Commits
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: ...` for new features.
- `fix: ...` for bug fixes.
- `docs: ...` for documentation changes.
- `refactor: ...` for code changes that neither fix a bug nor add a feature.

### 3. Pull Request Requirements
- Must pass `npm run lint`.
- Must pass `npx tsc --noEmit`.
- Must include a clear description of changes.
- Must link to a related issue if applicable.

## 🛠️ Coding Standards

- **TypeScript:** Use strict typing; avoid `any`.
- **Styling:** Use Tailwind v4 logical properties (e.g., `ms-2` instead of `ml-2`) to support RTL automatically.
- **Components:** Functional components with Hooks only.
- **Data:** Never hardcode strings; use `src/locales/` for UI and `src/data/` for content.

---
*For our community standards, see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).*
*For a list of contributors, see [CONTRIBUTORS.md](CONTRIBUTORS.md).*
