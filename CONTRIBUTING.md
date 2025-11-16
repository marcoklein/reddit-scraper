# Contributing to Reddit Scraper

Thank you for your interest in contributing to reddit-scraper! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Releasing a New Version](#releasing-a-new-version)

## Code of Conduct

This project follows standard open source community guidelines. Be respectful, constructive, and collaborative in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/reddit-scraper.git
   cd reddit-scraper
   ```
3. Add the upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/originalowner/reddit-scraper.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)
- Reddit API credentials (see README.md for setup instructions)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Reddit API credentials:
   ```bash
   cp .env.sample .env
   # Edit .env and add your REDDIT_CLIENT_ID and REDDIT_SECRET
   ```

### Development Commands

- **Run in development mode**: `npm run dev -- --subreddit improv --verbose`
- **Build the project**: `npm run build`
- **Type check**: `npm run lint`
- **Run built CLI**: `npm run cli -- --subreddit improv`

## Code Style Guidelines

This project uses TypeScript with strict mode enabled. Please follow these conventions:

### Imports
- Use ES modules with `import` syntax (not CommonJS)
- Use `import type` for type-only imports:
  ```typescript
  import type { RedditListing } from './types';
  ```
- Use relative imports with explicit file paths (e.g., `"../types"`)

### Types
- Use explicit type annotations for function parameters and return types
- Define interfaces for all data structures
- Prefer `interface` over `type` for object shapes
- Avoid `any`; use explicit types or `Record<string, any>` for unknown objects

### Naming Conventions
- **camelCase** for variables, functions, and parameters (e.g., `accessToken`, `fetchPostBatch`)
- **PascalCase** for interfaces and types (e.g., `RedditListing`, `PostData`)
- Use descriptive names that convey purpose

### Error Handling
- Throw errors with descriptive messages for critical failures
- Use try-catch blocks in top-level functions
- Log errors with context before re-throwing or exiting
- Check for required environment variables early and throw if missing

### Code Quality
- Run `npm run lint` before committing to ensure type safety
- Ensure code builds successfully with `npm run build`
- Keep functions focused and single-purpose
- Add comments for complex logic

## Making Changes

### Branching Strategy

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes, following the code style guidelines above

3. Ensure your code passes type checking:
   ```bash
   npm run lint
   ```

4. Build the project to ensure it compiles:
   ```bash
   npm run build
   ```

5. Test your changes manually:
   ```bash
   npm run dev -- --subreddit improv --verbose
   ```

### Commit Messages

Write clear, concise commit messages:
- Use present tense ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issues when applicable (e.g., "Fix #123: Handle empty responses")

## Submitting Changes

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request (PR) on GitHub with:
   - A clear title describing the change
   - A description explaining what changed and why
   - Reference to any related issues

3. Wait for review and address any feedback

## Releasing a New Version

This section is for maintainers with publish access to npm.

### Pre-release Checklist

1. Ensure all tests pass (when tests are added) and type checking succeeds:
   ```bash
   npm run lint
   npm run build
   ```

2. Update version in `package.json` following [Semantic Versioning](https://semver.org/):
   - **MAJOR** version (e.g., 1.0.0 → 2.0.0): Breaking changes
   - **MINOR** version (e.g., 0.1.0 → 0.2.0): New features, backwards compatible
   - **PATCH** version (e.g., 0.1.0 → 0.1.1): Bug fixes, backwards compatible

3. Update CHANGELOG.md (if present) or document changes in release notes

### Release Steps

1. Update the version number:
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```
   
   This command will:
   - Update `package.json` and `package-lock.json`
   - Create a git commit with the version bump
   - Create a git tag (e.g., `v0.1.1`)

2. Review the automated changes:
   ```bash
   git show
   ```

3. Push the commit and tags to GitHub:
   ```bash
   git push origin main
   git push origin --tags
   ```

4. Publish to npm:
   ```bash
   npm publish
   ```
   
   Note: The `prepublishOnly` script will automatically run `npm run lint && npm run build` before publishing.

5. Create a GitHub Release (optional but recommended):
   - Go to the repository's "Releases" page
   - Click "Draft a new release"
   - Select the version tag you just created
   - Add release notes describing changes
   - Publish the release

### Post-release

1. Verify the package on npm:
   ```bash
   npm view reddit-scraper
   ```

2. Test installation:
   ```bash
   npx reddit-scraper@latest --help
   ```

### Troubleshooting Releases

- **"You cannot publish over the previously published versions"**: You're trying to publish a version that already exists. Bump the version number.
- **"You do not have permission to publish"**: Ensure you're logged into npm with an account that has publish access:
  ```bash
  npm login
  npm whoami
  ```
- **Build fails during prepublishOnly**: Fix the build or type errors before attempting to publish again.

## Questions?

If you have questions about contributing, feel free to open an issue on GitHub for discussion.

## License

By contributing to reddit-scraper, you agree that your contributions will be licensed under the MIT License.
