# Testing Guidelines

## API Testing

### Common Issues

#### OpenAPI Specification Validation

Our API middleware validates responses against the OpenAPI specification. If a route returns a status code that is not defined in the spec, the middleware will convert it to a 500 error.

**Common symptoms:**

- Tests expecting specific error codes (like 403, 404) receive 500 errors instead
- Console output shows warnings like: `====== no schema defined for status code '403' in the openapi spec ======`

**How to fix:**

1. Check the OpenAPI specification in `specs/apis/routes/*.yaml` for the route you're testing
2. Ensure all status codes your route can return are properly defined in the spec
3. Run `npm run generate-specs` to update the generated specs

**Example:**
If your route handler includes:

```typescript
if (error instanceof UnauthorizedAccessError) {
  return next(createError(403, "Unauthorized access"));
}
```

Then your OpenAPI spec must include:

```yaml
"403":
  description: Forbidden - Unauthorized access
  content:
    application/json:
      schema:
        $ref: "../schemas/error.yaml"
```

### Testing Checklist

When adding tests for new API routes, ensure:

1. **Complete coverage**: Test all success and error paths
2. **Status code alignment**: Verify that all status codes returned by your implementation are defined in the OpenAPI spec
3. **Error handling**: Test that errors are properly caught and converted to appropriate HTTP responses
4. **Authorization**: Test both authorized and unauthorized access scenarios

## Running Tests

To run API tests:

```bash
cd services/api
npm run test
```

To run specific test files:

```bash
npm run test -- routes/your-route.test.ts
```

## Debugging Failed Tests

When tests fail with unexpected status codes:

1. Check the console output for OpenAPI validation warnings
2. Compare the route implementation with the OpenAPI specification
3. Update either the implementation or the specification to align them
