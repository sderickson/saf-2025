# Feature Implementation Checklist Template

This is a template for adding features. Whenever a new feature is added, follow this checklist.


### Planning Phase

**IMPORTANT**: Check off completed steps as they are done.

- [ ] Write specification
  - [ ] Make a copy of the /notes/feature-spec-template.md document, put it in /notes/<feature-name>/spec.md
  - [ ] Fill in each section
  - [ ] Ask questions to clarify any ambiguities
- [ ] **Review Point**: Review the specification before proceeding to implementation.

- [ ] Update checklist
  - [ ] Update the checkbox contents for what is necessary for this feature based on the spec.
  - [ ] Break down complex tasks into smaller, manageable subtasks.
  - [ ] Note: {} indicates something to fill in or choose. ... means repeat as necessary.
- [ ] **Review Point**: Review the checklist with stakeholders before proceeding to implementation.

### Implementation Phase

- [ ] Update API specification

  - [ ] Review [API specification guidelines](/saf-2025/lib/ts-openapi/docs/update-spec.md)
  - [ ] Update /specs/apis/openapi.yaml with new and updated routes:
    - [ ] {Add/update} route {route-path}
    - [ ] ...
    - [ ] Run `npm run generate` from /specs/apis, ensure it succeeds.
  - [ ] **Review Point**: Review API specification changes before proceeding.

- [ ] Add stub endpoints

  - [ ] Update /services/api/routes with stub data
    - [ ] Review [adding route guidelines](/saf-2025/lib/node-express/docs/adding-routes.md)
    - [ ] {Add/update} route {route-path}
      - [ ] Implement basic request validation
      - [ ] Return mock data
    - [ ] ...
  - [ ] Test stub endpoints
    - [ ] Review [adding route test guidelines](/saf-2025/lib/node-express/docs/testing.md)
    - [ ] Verify correct responses
    - [ ] Verify error handling
  - [ ] **Review Point**: Review stub endpoints implementation before proceeding.

- [ ] Add to database

  - [ ] Update /dbs/main/...
    - [ ] Add to /src/schema.ts
      - [ ] Review [the schema guidelines](/saf-2025/lib/drizzle-sqlite3/docs/schema.md)
      - [ ] Define new tables/fields according to the guidelines
    - [ ] Run `npm run generate` from /dbs/main to create migration files
    - [ ] Add queries
      - [ ] Review [the query guidelines](/saf-2025/lib/drizzle-sqlite3/docs/queries.md)
      - [ ] Create queries based on these guidelines, creating Error classes as needed
      - [ ] Write tests which include the database (no mocking)
      - [ ] Export the queries for use by services
  - [ ] **Review Point**: Review database schema and query implementation before proceeding.

- [ ] Connect storage with endpoints

  - [ ] Update /services/api/routes to use newly created queries
  - [ ] Add authentication and authorization checks
  - [ ] Implement proper error handling
  - [ ] Update tests to mock db responses
    - [ ] Review [the mocking guidelines](/saf-2025/lib/node-express/docs/mocking.md)
    - [ ] Mock the database modules according to these guidelines.
  - [ ] **Review Point**: Review the connection between storage and endpoints before proceeding.

- [ ] Add client requests

  - [ ] {Add/update} /clients/requests/{module}.ts to handle new endpoints
    - [ ] Review [adding query guidelines](/saf-2025/lib/vue-spa/docs/adding-queries.md)
    - [ ] Implement request functions according to those guidelines.
    - [ ] Add proper error handling
    - [ ] Add tests
      - [ ] Review [query testing guidelines](/saf-2025/lib/vue-spa/docs/query-testing.md)
      - [ ] Add tests according to these guidlines
  - [ ] ...
  - [ ] **Review Point**: Review client request implementation before proceeding.

- [ ] Create a new SPA if necessary

  - [ ] Only do this if the new feature requires one
  - [ ] Review [adding spa guidelines](/saf-2025/lib/vue-spa/docs/add-spa.md)
  - [ ] Create a new SPA according to those guidelines

- [ ] Add stub user interface

  - [ ] Add stub page at /clients/{spa}/pages/{page-name}/{Page}.vue
    - [ ] Have it be a static page
    - [ ] Extend the /clients/{spa}/router.ts with the new page
  - [ ] ...
  - [ ] Extend page with UI with mock data
    - [ ] If there are form elements, create refs as necessary
  - [ ] ...
  - [ ] **Review Point**: Review client request implementation before proceeding.

- [ ] Refactor components

  - [ ] Consider if the additions would be better broken down
  - [ ] Break down large single-use-case components, into a `/components` folder within the {page-name} folder
  - [ ] For components that can be used in multiple scenarios, put within the /clients/shared/components folder

- [ ] Test components

  - [ ] For each component, create a {Component}.test.ts file adjacent.
  - [ ] Review [component testing guidelines](/saf-2025/lib/vue-spa/docs/component-testing.md)
  - [ ] Add tests according to these guidelines
  - [ ] Run `npm run test` within `/clients` and make sure tests pass
  - [ ] **Review Point**: Review client request implementation before proceeding.

- [ ] Wire up components

  - [ ] Review [using query guidelines](/saf-2025/lib/vue-spa/docs/using-queries.md)
  - [ ] Implement data fetching following these guidelines, and existing queries in /clients/requests/
  - [ ] If the data can be mutated (there's a form on the page)
    - [ ] Review [form guidelines](/saf-2025/lib/vue-spa/docs/forms.md)
    - [ ] Implement form based on those guidelines
  - [ ] **Review Point**: Review user interface implementation before proceeding.

- [ ] Test end-to-end

  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass.
  - [ ] Create test in /tests/e2e for new user flow happy path
  - [ ] Run to make sure it works
  - [ ] **Review Point**: Review end-to-end test results before proceeding to post-implementation.

- [ ] Run unit tests
  - [ ] Run `npm run test` from the root folder to make sure all unit tests still work
  - [ ] Fix any that have broken
