# Creating TypeScript Packages

This guide outlines the best practices for creating TypeScript packages in the Vendata monorepo.

## Package Structure

A typical TypeScript package should have the following structure:

```
package-name/
├── package.json
├── tsconfig.json
└── src/           # Source files
    └── index.ts   # Main entry point
```

## Package.json

The `package.json` should be minimal and focused:

```json
{
  "name": "@vendata/package-name",
  "description": "Brief description of the package",
  "private": true,
  "main": "dist/index.ts",
  "scripts": {
    "clean": "rm -rf dist",
    "test": "vitest"
  }
}
```

Key points:

- No version field needed (we're not publishing)
- `main` points to the TypeScript file (we strip types at runtime)
- No separate types field needed
- Use vitest for testing

## TypeScript Configuration

There are two types of TypeScript packages:

### 1. Regular TypeScript Packages

For packages that contain TypeScript source code that can be imported:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### 2. Generated TypeScript Packages

For packages that only contain generated TypeScript (e.g., from protobuf):

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["dist/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

Key points:

- Extend the root tsconfig
- Set `noEmit: true` since no compilation into JS is rarely necessary
- Only override necessary options

## Dependencies

### Adding New Dependencies

1. Add the package to your package.json without versions:

```json
{
  "dependencies": {
    "package-name": "*"
  },
  "devDependencies": {
    "dev-package-name": "*"
  }
}
```

2. Run `npm install` from the root directory to:
   - Install the latest versions
   - Ensure consistent versions across the monorepo
   - Set up proper workspace linking

### Workspace Dependencies

If your package depends on another package in the monorepo:

1. Add it as a dependency in your package.json:

```json
{
  "dependencies": {
    "@vendata/other-package": "*"
  }
}
```

2. Run `npm install` from the root directory

## Import Rules

1. Always use `.ts` extension in imports (not `.js`)
2. Use relative imports (e.g., `./file.ts`) for files within the same package
3. Use package names (e.g., `@vendata/package-name`) for imports from other packages
4. Never use relative paths with `../` to import from other packages

Example:

```typescript
// Good - importing from same package
import { Something } from "./something.ts";

// Good - importing from another package
import { OtherThing } from "@vendata/other-package/src/thing.ts";

// Bad - using .js extension
import { Something } from "./something.js";

// Bad - using relative path to another package
import { OtherThing } from "../../other-package/src/thing.ts";
```

## Generated Code

If your package includes generated code (e.g., from protobuf):

1. Generate into the `dist` directory
2. Include the generated files in your package
3. Make sure the generation script is documented, and runs as "npm run generate"
4. Consider adding a preinstall hook to ensure generation happens

## Testing

- Use vitest for testing
- Place tests adjacent to what they test, with `.test.ts` suffix
