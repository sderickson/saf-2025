*NOTE: This doc is out of date - need to update this. Some is true, some needs to be vetted*

# Instructions

Documentation for each workflow at the monorepo level.

## Create a new library package

When creating a new shared library package in the monorepo (e.g. in `lib/`, `dbs/`, etc.):

1. Create the package directory structure:

   ```bash
   mkdir -p path/to/your-package/src
   ```

2. Create `package.json` with:

   - Name as `@saf/scope-package-name` (e.g. `@saf/dbs-auth`, `@saf/node-express`)
   - `type: "module"` for ES modules
   - `main` field pointing to the entry point (e.g. `"./src/index.ts"`) - this is required for TypeScript to properly resolve types
   - Standard test commands:
     ```json
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage"
     }
     ```
   - Required dependencies and devDependencies
   - Use `peerDependencies` for shared framework dependencies

3. Create `tsconfig.json` that extends the root config:

   ```json
   {
     "extends": "../../tsconfig.json",
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist", "**/*.test.ts"]
   }
   ```

4. Create `vitest.config.mts`:

   ```typescript
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     test: {
       globals: true,
       environment: "node",
     },
   });
   ```

5. Create a README.md with:

   - Package description
   - Note about workspace installation
   - Usage examples
   - Development instructions

6. Organize source code:

   - Place implementation in `src/`
   - Use `src/index.ts` as the package entry point
   - Place tests alongside source files with `.test.ts` suffix
   - Group related functionality in subdirectories

7. Add test dependencies:
   - `vitest` for testing
   - `@vitest/coverage-v8` for coverage reporting

Note: The package will be automatically included in the workspace through patterns like `"lib/*"`, `"dbs/*"` in the root package.json. No build step is needed as we use ts-node throughout the monorepo.

## TypeScript Best Practices

When writing code in this monorepo:

1. File naming and imports:

   - Always use `.ts` extension for TypeScript files
   - For imports in this monorepo:

     ```typescript
     // Use .ts extension in import statements since we use Node's experimental
     // type stripping without transpilation
     import { something } from "./other-file.ts";

     // Note: This is different from traditional TypeScript setups where .js would be used
     // We can use .ts directly because Node executes the TypeScript files directly
     ```

   - Use `.mts` for module configuration files (e.g. `vitest.config.mts`)
   - Use `.ts` for all other TypeScript files including tests

2. Use proper type imports:

   - Use `import type` for type-only imports to improve build performance and clarity:

     ```typescript
     // Do this:
     import type { Request, Response } from "express";

     // Not this:
     import { Request, Response } from "express";
     ```

   - Exception: When the import is used both as a type and value, use regular import

3. Prefer explicit typing:

   - Add return types to functions
   - Define interfaces/types for complex objects
   - Use type parameters for generics
   - Only use type inference when the types are obvious and simple

4. Configuration:

   - All TypeScript configuration should extend from the root `tsconfig.json`
   - Keep strict mode enabled
   - Use `paths` aliases defined in root config for clean imports

5. Common patterns:
   - Use interface for extendable object types
   - Use type for unions, intersections, and mapped types
   - Leverage utility types (Pick, Omit, Partial, etc.)
   - Use const assertions for literal types
