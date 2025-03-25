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
- Each implementation section MUST start with reviewing relevant documentation
- If no relevant documentation exists for a section, create it after implementation
- After generating or updating every file, ask for a review

### Planning Phase

- [ ] Write specification
  - [ ] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/<feature-folder>/spec.md
  - [ ] Fill in each section
  - [ ] Ask questions to clarify any ambiguities
- [ ] **Review Point**

- [ ] Update checklist
  - [ ] Update the checkbox contents for what is necessary for this feature based on the spec
  - [ ] Break down complex tasks into smaller, manageable subtasks
  - [ ] Review [system-prompt.md](./system-prompt.md) and identify relevant platform docs for each implementation section
  - [ ] Note where new platform documentation will need to be created
- [ ] **Review Point**

### Implementation Phase

Each implementation section should follow this pattern:

```markdown
## {Component} Layer

- [ ] Review Documentation

  - [ ] Review relevant docs from system-prompt.md
  - [ ] Note any missing platform documentation needs
  - [ ] **Review Point**

- [ ] Implementation Task

  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] **Review Point**

- [ ] Update Documentation
  - [ ] Update/create platform documentation if needed:
    - [ ] Add new capabilities to relevant lib/\*_/docs/_.md
    - [ ] Update package README.md with new functionality
  - [ ] Update product documentation if needed:
    - [ ] Update README.md adjacent to the appropriate package.json
    - [ ] Add API documentation
    - [ ] Add configuration documentation
  - [ ] **Review Point**
```

For example:

```markdown
## Database Layer

- [ ] Review Documentation

  - [ ] Review [schema.md](../lib/drizzle-sqlite3/docs/schema.md)
  - [ ] Review [queries.md](../lib/drizzle-sqlite3/docs/queries.md)
  - [ ] Review [testing.md](../lib/drizzle-sqlite3-dev/docs/testing.md) (TODO!)
  - [ ] Note any missing documentation needs
  - [ ] **Review Point**

- [ ] Implement Schema Changes

  - [ ] Write schema tests
  - [ ] Add table definitions
  - [ ] Run tests
  - [ ] **Review Point**

- [ ] Update Documentation
  - [ ] Update platform docs:
    - [ ] Make edits to the docs reviewed above, based on how implementation went
    - [ ] Add new docs for any new or under-documented platform capabilities
  - [ ] Update product docs:
    - [ ] Update README.md with schema changes
    - [ ] Document migration process if needed
  - [ ] **Review Point**
```

### Testing Phase

- [ ] Test end-to-end

  - [ ] Review [e2e-testing.md](../lib/playwright/docs/e2e-testing.md) (TODO!)
  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass
  - [ ] Create test in /tests/e2e/specs for new user flow happy path
  - [ ] Run to make sure it works
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run test:coverage` and fill in any major gaps
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check that all platform changes are documented
  - [ ] Check that all product changes are documented
  - [ ] Verify documentation matches implementation
  - [ ] Check for any missing documentation that should be created
  - [ ] **Review Point**
