# Auth Database Library Refactoring Checklist

## Planning Phase

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

## Implementation Phase

### Database Layer

- [ ] Review Documentation

  - [ ] Review [schema.md](../lib/drizzle-sqlite3/docs/schema.md)
  - [ ] Review [queries.md](../lib/drizzle-sqlite3/docs/queries.md)
  - [ ] Review [testing.md](../lib/drizzle-sqlite3-dev/docs/testing.md)
  - [ ] Note any missing documentation needs
  - [ ] **Review Point**

- [ ] Create New Package Structure

  - [ ] Create `lib/auth-db` directory
  - [ ] Initialize package.json with correct dependencies
  - [ ] Set up TypeScript configuration
  - [ ] Create basic package structure (src/, tests/, docs/)
  - [ ] **Review Point**

- [ ] Migrate Database Implementation

  - [ ] Move SQLite database implementation from `dbs/auth`
  - [ ] Update imports and dependencies
  - [ ] Ensure all tests pass
  - [ ] **Review Point**

- [ ] Implement Multi-Service Support

  - [ ] Add connection pooling
  - [ ] Implement file locking mechanism
  - [ ] Add connection management utilities
  - [ ] Write tests for concurrent access
  - [ ] **Review Point**

- [ ] Update Documentation
  - [ ] Create package README.md
  - [ ] Document database sharing patterns
  - [ ] Add API documentation
  - [ ] Add configuration documentation
  - [ ] **Review Point**

### Integration Layer

- [ ] Update Existing Services

  - [ ] Update auth service to use new library
  - [ ] Update any other services using auth database
  - [ ] Verify all functionality works
  - [ ] **Review Point**

- [ ] Migration Support
  - [ ] Create migration utilities
  - [ ] Document migration process
  - [ ] Create migration tests
  - [ ] **Review Point**

## Testing Phase

- [ ] Test end-to-end

  - [ ] Review [e2e-testing.md](../lib/playwright/docs/e2e-testing.md)
  - [ ] Create production docker images
  - [ ] Run existing tests
  - [ ] Create new tests for multi-service scenarios
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run test:coverage`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**

## Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check that all platform changes are documented
  - [ ] Check that all product changes are documented
  - [ ] Verify documentation matches implementation
  - [ ] Check for any missing documentation
  - [ ] **Review Point**
