# @saf/node-express

Shared Express.js utilities for SAF services.

## Installation

This package is part of the SAF monorepo and is installed automatically through npm workspaces.

## Usage

### Request ID Middleware

Adds a unique request ID to each incoming request. The ID is generated using UUID v4 and truncated to 8 characters.
This ID can be used for request tracing and logging correlation.

```typescript
import express from "express";
import { requestId } from "@saf/node-express";

const app = express();

// Add the request ID middleware
app.use(requestId);

// The request ID is now available on req.id
app.use((req, res, next) => {
  console.log(`Request ID: ${req.id}`);
  next();
});
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```
