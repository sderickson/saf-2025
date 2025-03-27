# Auth Service Library Implementation Checklist

## Planning Phase

- [ ] Write specification

  - [x] Create spec.md with comprehensive requirements
  - [x] **Review Point**

- [ ] Update checklist
  - [x] Create detailed implementation steps
  - [x] **Review Point**

## Implementation Phase

### Package Setup

- [x] Create Package Structure
  - [x] Create new package in `saflib/auth-service`
  - [x] Set up package.json with dependencies
  - [x] **Review Point**

### Core Implementation

- [x] Copy over entire auth service from `services/auth`
- [x] make sure unit tests still work

### Migration

- [x] update deploy/instance files
- [x] make sure npm run dev works
- [x] make sure npm run build works
- [x] delete auth endpoints from spec/apis

### Optimization

- [x] update dockerfiles to share "saflib" layers

## Testing Phase

- [x] make sure e2e tests still work

- [x] Quality Checks
  - [x] Run `npm run test`
  - [x] Run `npm run lint`
  - [x] Run `npm run format`
  - [x] **Review Point**
