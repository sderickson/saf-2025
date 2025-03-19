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

Don't specify dependency versions in package.json. Instead, install them fresh:

```bash
# For runtime dependencies
npm install @package-name

# For dev dependencies
npm install -D @package-name
```

This ensures you always get the latest compatible versions.

## Generated Code

If your package includes generated code (e.g., from protobuf):

1. Generate into the `dist` directory
2. Include the generated files in your package
3. Make sure the generation script is documented, and runs as "npm run generate"
4. Consider adding a preinstall hook to ensure generation happens

## Testing

- Use vitest for testing
- Place tests adjacent to what they test, with `.test.ts` suffix
