# Template Service

This is a template for creating new microservices in the SAF architecture. It provides a standardized starting point with common patterns and best practices.

## Features

- Express.js web framework
- TypeScript support
- OpenAPI validation
- Request logging with Morgan and Winston
- Request ID tracking
- Error handling middleware
- Testing setup with Vitest
- Docker support with health checks
- Example route implementation

## Directory Structure

```
services/__template__/
├── bin/               # Server entry point
│   └── www            # Server startup script
├── routes/            # Route handlers
│   ├── example.ts     # Example route implementation
│   └── example.test.ts# Example route tests
├── app.ts             # Express application setup
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── vitest.config.mts  # Test configuration
```

## Getting Started

1. Copy this template directory to create a new service:

   ```bash
   cp -r services/__template__ services/your-service-name
   ```

2. Update the package name in `package.json`:

   ```json
   {
     "name": "@saf/services-your-service-name"
   }
   ```

3. Install dependencies:

   ```bash
   cd services/your-service-name
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Development Guidelines

### Adding New Routes

1. Create a new route file in the `routes` directory
2. Follow the patterns in `routes/example.ts`
3. Add corresponding test file
4. Import and use the route in `app.ts`

### Error Handling

- Use the provided error handling middleware
- Throw `http-errors` for HTTP-specific errors
- Log errors appropriately

### Testing

- Write tests for all routes
- Follow patterns in `example.test.ts`
- Test both success and error cases
- Use supertest for HTTP testing

### Logging

- Use the provided logger via `req.log`
- Include request ID in log messages
- Log appropriate levels (info, warn, error)

### Environment Variables

- `PORT`: Server port (should default to 3000)
- `NODE_ENV`: Environment (development/production)
- Add other service-specific variables as needed

## OpenAPI Validation

- Add your API specifications to `specs/apis/openapi.yaml`
- Validation is automatic for all routes
- Test against the specification

### Docker Support

- Use the provided Dockerfile
- Build: `docker build -t your-service .`
- Run: `docker run -p 3000:3000 your-service`
- Alternatively with docker-compose from the root directory:
  - Generate docker-compose.yaml and Dockerfile: `cd /tools && npm run generate-docker`
  - For docker-compose-specific settings, create a docker-compose.yaml.template file.
  - Build: `docker-compose build your-service`
  - Run: `docker-compose up your-service (--build)`

### Health Checks

The service includes a health check endpoint at `/health` and Docker health check configuration:

- HTTP endpoint: `GET /health` returns 200 OK when service is healthy
- npm script: `npm run healthcheck` for container health checks
- Docker configuration: Checks every 30s with 3s timeout
- Health check is used by container orchestration for service monitoring

### Package Management

- Use `npm` for package management
- To install an internal package, use `npm install @saf/services-your-service-name`
- To update your Dockerfile to include the internal package, run `cd /tools && npm run generate-docker`
