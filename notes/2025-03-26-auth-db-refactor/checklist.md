# Auth Database Library Refactoring Checklist

## Planning Phase

- [x] Write specification
  - [x] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/<feature-folder>/spec.md
  - [x] Fill in each section
  - [x] Ask questions to clarify any ambiguities
- [x] **Review Point**

- [x] Update checklist
  - [x] Update the checkbox contents for what is necessary for this feature based on the spec
  - [x] Break down complex tasks into smaller, manageable subtasks
  - [x] Note where new platform documentation will need to be created
- [x] **Review Point**

## Implementation Phase

### Database Layer

- [x] Create New Package Structure

  - [x] Create `lib/auth-db` directory
  - [x] Initialize package.json with correct dependencies
  - [x] Set up TypeScript configuration
  - [x] Create basic package structure (src/, tests/, docs/)
  - [x] **Review Point**

- [x] Migrate Database Implementation

  - [x] Move SQLite database implementation from `dbs/auth`
  - [x] Update imports and dependencies
  - [x] Ensure all tests pass
  - [x] **Review Point**

- [x] Update Documentation

  - [x] Create package README.md
  - [x] Document basic usage
  - [x] **Review Point**

- [x] Test Multi-File Access

  - [x] Write a test which instantiates two AuthDb instances pointing to the same database file
  - [x] See if they can read/write to the same database file and observe each others' changes
  - [x] **Review Point**

- [ ] Update `services/auth` to use new AuthDb

  - [ ] Update imports to use new AuthDb
  - [ ] Update tests to use new AuthDb
  - [ ] Make sure services/auth unit tests pass

- [ ] Update deployment
  - [ ] Update docker file in /services/auth as needed
  - [ ] Update docker compose files in /deploy/instance as needed
  - [ ] Run `npm run dev -- --build` from /deploy/instance and check the volumes work
  - [ ] Run `npm run build` from /deploy/instance and check that it works
  - [ ] Run `npm run test` in /tests/e2e and check that it works
  - [ ] **Review Point**

## Testing Phase

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run test:coverage` - check for major coverage gaps
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
