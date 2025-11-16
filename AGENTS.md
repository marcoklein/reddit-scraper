# Agent Guidelines for reddit-scraper

## Build/Run Commands
- Run main script: `npm start` (requires build first)
- Run scraper in dev mode: `npm run dev -- --subreddit improv`
- Build project: `npm run build`
- Install dependencies: `npm install`
- Type check: `npm run lint`
- No test suite currently exists

## Code Style

### Imports
- Use ES modules with `import` syntax (not CommonJS)
- Type imports use `import type` for interfaces/types (e.g., `import type { RedditListing } from "../types"`)
- Relative imports use explicit file paths (e.g., `"../types"`)

### Types
- Strict TypeScript enabled (`strict: true` in tsconfig.json)
- Use explicit type annotations for function parameters and return types
- Define interfaces for all data structures (prefer `interface` over `type` for object shapes)
- Use `any` sparingly; prefer explicit types or `Record<string, any>` for unknown objects

### Naming Conventions
- camelCase for variables, functions, and parameters (e.g., `accessToken`, `fetchPostBatch`)
- PascalCase for interfaces and types (e.g., `RedditListing`, `PostData`)
- Descriptive names that convey purpose (e.g., `getAuthorizationToken`, `parseCommentTree`)

### Error Handling
- Throw errors with descriptive messages for critical failures
- Use try-catch blocks in top-level functions (e.g., `main()`)
- Log errors to console with context before re-throwing or exiting
- Check for required environment variables and throw early if missing

### Environment
- Uses Node.js runtime (>=18.0.0)
- Environment variables: `REDDIT_CLIENT_ID`, `REDDIT_SECRET`
- Node.js APIs: `fs/promises` for file operations, `process.argv` for CLI args
