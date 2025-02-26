# API Specifications

This directory contains the OpenAPI specifications for our API endpoints.

## Directory Structure

```
specs/apis/
├── openapi.yaml       # Root OpenAPI specification
├── routes/           # Route specifications
│   ├── auth.yaml
│   ├── todos.yaml
│   └── ...
└── schemas/          # Shared schema definitions
    ├── user.yaml
    ├── error.yaml
    └── ...
```

## Adding New Endpoints

1. Create schema file in `schemas/` if needed

   ```yaml
   type: object
   properties:
     id:
       type: integer
     # ... other properties
   required:
     - id
     # ... other required fields
   ```

2. Create route file in `routes/` following this pattern:

   ```yaml
   get:
     summary: List all items
     tags:
       - Feature Name
     responses:
       "200":
         description: Success response
         content:
           application/json:
             schema:
               type: array
               items:
                 $ref: "../schemas/your-schema.yaml"
       "401":
         description: Unauthorized
         content:
           application/json:
             schema:
               $ref: "../schemas/error.yaml"

   /{id}:
     get:
       # Single item endpoint
     put:
       # Update endpoint
   ```

3. Add paths to `openapi.yaml`:

   ```yaml
   paths:
     /your-feature:
       get:
         $ref: "./routes/your-feature.yaml#/get"
       post:
         $ref: "./routes/your-feature.yaml#/post"
     /your-feature/{id}:
       get:
         $ref: "./routes/your-feature.yaml#/{id}/get"
       put:
         $ref: "./routes/your-feature.yaml#/{id}/put"
   ```

4. Add schema reference to components in `openapi.yaml`:

   ```yaml
   components:
     schemas:
       YourFeature:
         $ref: "./schemas/your-feature.yaml"
   ```

5. Generate types and validation:
   ```bash
   cd specs/apis
   npm run generate
   ```

## Common Patterns

- Use integer types for IDs (for SQLite compatibility)
- Include error responses with error schema
- Group related endpoints under feature-specific tags
- Follow existing examples in routes/ for consistent structure
