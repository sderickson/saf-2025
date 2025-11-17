# Templates

## String Interpolation

To streamline the process of adding new things to the codebase, template files can contain placeholders which will automatically be replaced in the copy step. The copy step takes as an optional input a `lineReplace` function to perform string transformations on the template files **and paths**.

The `saflib/workflows` library provides one function, `makeLineReplace`, which will replace strings wrapped in double underscores with the given context. It assumes the context will have key values in `camelCase` with values in `kebab-case`. Then it will look for all string variations of the key, such as `kebab-case`, `snake_case`, `PascalCase`, `camelCase`, and `SNAKE_CASE`, and replace them with the value with the appropriate casing and connecting characters. It also replaces instances of `template-package` with the value of the `sharedPackagePrefix` context key, if it exists, which is a special case because npm package names cannot start with an underscore, and template package.json files should still be valid packages.

The library also comes with helper functions to assist in templating:
- `getPackageName` - reads the package.json for the given cwd and returns the package name.
- `parsePackageName` - takes a package name and returns a breakdown into conventional parts for templating. It assumes the package name is the service name followed by the kind of package it is, such as `-http`, `-db`, `-common`, etc. Provides:
  - `organizationName` - the organization name, such as `saflib`.
  - `packageName` - the full package name, such as `@saflib/product-http`.
  - `serviceName` - the service name, such as `product`.
  - `sharedPackagePrefix` - the shared package prefix, such as `@saflib/product`.
- `parsePath` - takes a target path to a file and breaks it down into conventional parts for templating, such as `./routes/gizmos/list.ts`. Provides:
  - `groupName` - the group name, such as `gizmos`.
  - `targetName` - the target name, such as `list`.

Put all together, a workflow (in this case to add an http route) that uses the provided helpers will look like this:

```ts
import {
  CopyStepMachine,
  UpdateStepMachine,
  defineWorkflow,
  step,
  parsePath,
  parsePackageName,
  getPackageName,
  makeLineReplace,
  type ParsePathOutput,
  type ParsePackageNameOutput,
} from "@saflib/workflows";

const sourceDir = path.join(import.meta.dirname, "./templates");

const input = [ { name: "path" } ] as const;

interface WorkflowContext
  extends ParsePathOutput,
    ParsePackageNameOutput {}

export const WorkflowDefinition = defineWorkflow<typeof input, WorkflowContext>({
  // ...

  context: ({ input }) => {
    return {
      ...parsePath(input.path, {
        requiredPrefix: "./routes/",
        requiredSuffix: ".ts",
        cwd: input.cwd,
      }),
      ...parsePackageName(getPackageName(input.cwd), {
        requiredSuffix: "-http",
      }),
    };
  },
  
  // ...

  steps: [
    step(CopyStepMachine, ({ context }) => ({
      name: context.targetName,
      targetDir: context.targetDir,
      lineReplace: makeLineReplace(context),
    })),

    // ...

  ],
});
```

See a full example [here](https://github.com/sderickson/saflib/blob/main/express/workflows/templates/routes/__group-name__/__target-name__.ts).

## Adding TODOs

Usually agents will do what they're prompted to do, but not always; for this reason the `update` step will not allow the workflow to move forward until all instances of "todo" comments are removed from the file. Sprinkle these throughout your template with specific instructions to the agent, to both guide them and add a small but effective check that it gets done. 

## Best practices

### Templates should work

The reason the provided templating function uses underscores is these are valid variables in TypeScript; this way the template can actually compile and run. If you run the template tests, they should pass, and if you check types, they should be correct.

This also helps when your platform changes. If you change function signatures or deprecated functions, the template should be updated to reflect the latest and best way to do things.

To make sure template breakages are fixed, template files should also be part of CI checks. If a template test fails or its types are not correct, they should be fixed before changes are merged.

### Include instructions

## Advanced

### Package names

### Shared templates

### Monorepo templates

### Including one "thing"
