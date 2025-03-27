# Auth Service Library Feature Specification

## Overview

The Auth Service Library feature aims to refactor the authentication service into a reusable library package. This will allow other services to easily integrate authentication functionality while maintaining consistent behavior across the SAF-2025 framework. The library will encapsulate core authentication logic, passport configuration, and session management.

## User Stories

- As a service developer, I want to easily integrate authentication into my service so that I can protect my endpoints and manage user sessions
- As a framework maintainer, I want to centralize authentication logic so that security updates and improvements can be made in one place
- As a developer, I want consistent authentication behavior across all services so that users have a unified experience

## Technical Requirements

### Package Structure

- Create new package `@saflib/auth-service` in `lib/`
- Package should be TypeScript-based with proper type definitions
- Package should include comprehensive documentation and examples

### Core Components to Extract

1. Authentication Service

   - Session management
   - Passport configuration
   - User serialization/deserialization
   - Local strategy implementation
   - Error handling

2. Middleware

   - Authentication middleware
   - Session middleware
   - Database injection middleware
   - Error handling middleware

3. Types and Interfaces
   - Service configuration types
   - User types
   - Request augmentation types
   - Error types

### API Design

The library should expose a clean, type-safe interface:

```typescript
interface AuthServiceConfig {
  db: AuthDB;
  sessionSecret: string;
  cookieDomain: string;
  protocol: "http" | "https";
}

interface AuthService {
  // Core setup
  initialize(app: Express): void;

  // Middleware
  sessionMiddleware: RequestHandler;
  authMiddleware: RequestHandler;

  // Passport setup
  setupPassport(): void;

  // Error handling
  errorHandlers: ErrorRequestHandler[];
}
```

### Database Integration

- Maintain compatibility with `@saflib/auth-db`
- Support dependency injection of database instance
- Handle database errors appropriately

### Security Considerations

- Secure session configuration
- Proper cookie settings
- CSRF protection
- Rate limiting support
- Password hashing (using argon2)
- Secure error messages

## Implementation Considerations

### Performance

- Minimize database queries
- Efficient session storage
- Proper caching strategies

### Security

- No hardcoded secrets
- Secure defaults
- Proper error handling that doesn't leak sensitive information

### Compatibility

- Maintain backward compatibility with existing auth service
- Support Express.js middleware patterns
- TypeScript-first approach

### Testing

- Comprehensive test coverage
- Integration tests with example usage
- Security-focused tests

## Future Enhancements / Out of Scope

- OAuth provider integration
- Multi-factor authentication
- Social login providers
- Custom authentication strategies
- WebSocket authentication

## Questions and Clarifications

1. Should we support custom session stores beyond the default?
2. Do we need to support multiple authentication strategies simultaneously?
3. How should we handle session timeout configuration?
4. Should we provide a CLI tool for generating secure session secrets?
5. How should we handle database migrations in the library context?
