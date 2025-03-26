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

- [ ] Update Documentation
  - [ ] Create package README.md
  - [ ] Document basic usage
  - [ ] Add API documentation
  - [ ] **Review Point**

### Integration Layer

- [ ] Test Multi-Service Access
  - [ ] Temporarily update auth service to use new library
  - [ ] Temporarily update api service to use new library
  - [ ] Verify both services can read/write to the same database file
  - [ ] **Review Point**

## Testing Phase

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
