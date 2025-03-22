# Writing Feature Checklists

This is a template for adding features. Whenever a new feature is added, follow this checklist.

## Steps

To get started:

1. Create a folder in /notes with the name of the feature, prefixed with the date, e.g. 2025-03-23-auth
2. Make a copy of this file in that folder, call it "checklist.md"
3. Begin going through that checklist

**IMPORTANT**:

- Check off items as they are done.
- Update the plan if needed with what actually got done
- After generating or updating every file, ask for a review

### Planning Phase

- [ ] Write specification
  - [ ] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/<feature-folder>/spec.md
  - [ ] Fill in each section
  - [ ] Ask questions to clarify any ambiguities
- [ ] **Review Point**

- [ ] Update checklist
  - [ ] Update the checkbox contents for what is necessary for this feature based on the spec.
  - [ ] Break down complex tasks into smaller, manageable subtasks.
  - [ ] Note: {} indicates something to fill in or choose. ... means repeat as necessary.
- [ ] **Review Point**

### Implementation Phase

This section largely depends on the feature. Each implementation piece should follow a similar process:

- [ ] Implement task
  - [ ] Review <appropriate-doc.md> - this will tend to be in /saf-2025/lib/\*/docs
  - [ ] Write the implementation
  - [ ] Run `npm run generate` if needed
  - [ ] Add unit tests and run them - make sure they work with `npm run test`
  - [ ] **Review Point**
  - [ ] If necessary, add or update docs, especially if there were no appropriate docs to review

Implementation should be independent from "integration". That process should look something like this:

- [ ] Integrate task
  - [ ] Review <appropriate-doc.md> - this will tend to be in /saf-2025/lib/\*/docs
  - [ ] Add any package dependencies and run `npm install` from the root folder
  - [ ] Write the integration
  - [ ] Add/update tests and run them - make sure they work. You will likely need to add mocks.
  - [ ] **Review Point**
  - [ ] If necessary, add or update docs, especially if there were no appropriate docs to review

Note that the following are all separate implementation and integration tasks:

- Implement api specs
- Implement stub api endpoints
- Implement database queries
- Integrate api endpoints with database
- Implement vue query functions
- Implement static frontend
- Integrate frontend with vue query functions

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass.
  - [ ] Create test in /tests/e2e/specs for new user flow happy path
  - [ ] Run to make sure it works
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run test:coverage` and fill in any major gaps
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**
