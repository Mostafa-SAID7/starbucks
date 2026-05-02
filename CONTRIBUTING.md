# Contributing to Starbucks Egypt React Clone

First off, thank you for considering contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

- Use the bug report template
- Include detailed steps to reproduce
- Add screenshots if applicable
- Specify your environment details

### ✨ Suggesting Features

- Use the feature request template
- Explain the use case clearly
- Provide mockups if possible

### 💻 Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/starbucks-eg-react.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build project
npm run build
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing

### File Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── [Feature].tsx # Feature components
├── lib/              # Utility functions
└── types/            # TypeScript types
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(navbar): add mobile menu animation
fix(footer): correct RTL alignment issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Add Tests**: Include tests for new features
3. **Follow Style Guide**: Ensure code follows project conventions
4. **Update Changelog**: Add entry to CHANGELOG.md
5. **Request Review**: Tag maintainers for review
6. **Address Feedback**: Make requested changes promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Dependent changes merged

## Questions?

Feel free to open an issue for any questions or concerns!

---

**Thank you for contributing! 🙏**
