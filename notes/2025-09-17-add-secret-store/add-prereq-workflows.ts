import {
  defineWorkflow,
  step,
  makeWorkflowMachine,
  PromptStepMachine,
  DocStepMachine,
  CwdStepMachine,
} from "@saflib/workflows";
import { AddWorkflowDefinition } from "@saflib/workflows/workflows";
import path from "node:path";

const input = [] as const;

interface AddPrereqWorkflowsContext {}

const AddPrereqWorkflowsDefinition = defineWorkflow<
  typeof input,
  AddPrereqWorkflowsContext
>({
  id: "secrets/add-prereq-workflows",
  description:
    "Add all prerequisite workflows needed for the secrets service project",
  input,
  context: () => ({}),
  sourceUrl: import.meta.url,
  templateFiles: {},
  docFiles: {
    spec: path.join(import.meta.dirname, "./spec.md"),
  },
  steps: [
    step(PromptStepMachine, () => ({
      promptText: `This workflow will add all the prerequisite workflows needed for the secrets service project.

The workflows we need to add are:
1. monorepo/add-export - Add new exports (functions, classes, interfaces) to packages
2. protos/init - Create protocol buffer packages
3. protos/add-method - Add new gRPC methods to proto files
4. grpc/init - Create gRPC service packages
5. grpc/add-handler - Add gRPC handler implementations
6. sdk/add-form - Add form components to SDK packages
7. sdk/add-display - Add display components to SDK packages
8. sdk/add-query - Add TanStack queries to SDK packages
9. monorepo/add-doc - Add documentation to packages

These are all generic workflows that will be useful beyond just the secrets project.`,
    })),

    step(DocStepMachine, () => ({
      docId: "spec",
    })),

    step(PromptStepMachine, () => ({
      promptText: `First, we will add the monorepo/add-export workflow. This workflow should:
- Take inputs: name, path
- Copy/update a test file based on the name
- Add implementation
- Add tests
- Add the export to index.ts
- Update documentation (npm exec saf-docs generate)

This is the most fundamental workflow for free-form packages like env and secrets.`,
    })),

    step(CwdStepMachine, () => ({
      path: "./saflib/monorepo",
    })),

    // Add monorepo/add-export workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-export",
    })),

    // Add protos/init workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "init",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The protos/init workflow has been created. This workflow should:
- Create a new protocol buffer package
- Set up the basic proto file structure
- Configure protobuf compilation
- Add to the protos package (which needs to be created first)

This will be used to create @saflib/secrets-proto.`,
    })),

    // Add protos/add-method workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-method",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The protos/add-method workflow has been created. This workflow should:
- Take inputs: method name, request/response types, description
- Add the method to the proto file
- Update generated TypeScript types
- Add to the protos package

This will be used to add GetSecret, RegisterToken, etc. to the secrets proto.`,
    })),

    // Add grpc/init workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "init",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The grpc/init workflow has been created. This workflow should:
- Create a new gRPC service package
- Set up gRPC server/client infrastructure
- Configure protobuf integration
- Add to the grpc package (which needs to be created first)

This will be used to create @saflib/secrets-grpc.`,
    })),

    // Add grpc/add-handler workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-handler",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The grpc/add-handler workflow has been created. This workflow should:
- Take inputs: method name, handler implementation
- Add the handler to the gRPC service
- Create handler file with proper structure
- Add tests
- Update service registration

This will be used to implement GetSecret, RegisterToken handlers.`,
    })),

    // Add sdk/add-form workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-form",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The sdk/add-form workflow has been created. This workflow should:
- Take inputs: form name, fields, validation rules
- Create Vue form component
- Add TanStack Query integration
- Add form validation
- Add tests

This will be used to create SecretForm.vue.`,
    })),

    // Add sdk/add-display workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-display",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The sdk/add-display workflow has been created. This workflow should:
- Take inputs: display name, data structure, display type (table/card/list)
- Create Vue display component
- Add TanStack Query integration
- Add pagination/sorting if needed
- Add tests

This will be used to create SecretsTable.vue, PendingApprovalsTable.vue, etc.`,
    })),

    // Add sdk/add-query workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-query",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The sdk/add-query workflow has been created. This workflow should:
- Take inputs: query name, endpoint, method (GET/POST/etc)
- Create TanStack Query hook
- Add TypeScript types
- Add error handling
- Add tests

This will be used to create queries for secrets API endpoints.`,
    })),

    // Add monorepo/add-doc workflow
    step(makeWorkflowMachine(AddWorkflowDefinition), () => ({
      name: "add-doc",
    })),

    step(PromptStepMachine, () => ({
      promptText: `The monorepo/add-doc workflow has been created. This workflow should:
- Take inputs: doc name, doc type (README/API/guide), content
- Create documentation file
- Add to package documentation structure
- Update index/table of contents
- Add to docs package if applicable

This will be used to add documentation for the secrets service.`,
    })),

    step(PromptStepMachine, () => ({
      promptText: `All prerequisite workflows have been created! 

Next steps:
1. Implement each workflow with proper templates and logic
2. Test each workflow individually
3. Create the master secrets project workflow that uses these generic workflows
4. Run the master workflow to create the complete secrets service

The key insight is that by building these generic workflows first, we can create the entire secrets project using only workflow composition, making it reproducible and maintainable.`,
    })),
  ],
});

export default AddPrereqWorkflowsDefinition;
