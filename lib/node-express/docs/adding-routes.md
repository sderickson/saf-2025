# Adding New Routes

## Implementation Basics

- Use "createHander" for each handler. It basically just ensures errors are caught and passed to middleware, and that handlers use Promises.
- Files in the /routes folder should export a router which the app.ts uses
- For type checking, use "RequestSchema" and "ResponseSchema" from the openapi specs library. Have them enforce the types you receive and that you send.
- Handled errors should send status code and response objects directly. Unhandled errors should be passed to `next`.
- Routes should be in charge of http concerns. Ideally don't pass the req, res, or next parameters around, so that it's clear what parameters are being used and what response codes may occur.

Example:

```typescript
// In your routes/<>.ts file
export const exampleRouter = express.Router();

router.get("/route", async (req, res, next) => {
  const exampleRequest: RequestSchema<"exampleRoute"> = req.body;
  try {
    let exampleResponse: ResponseSchema<"exampleRoute", 200>;
    /* I/O like db requests happens here */
    exampleResponse = {
      /* ... */
    };
    res.json(exampleResponse);
  } catch (error) {
    // Handle specific error with appropriate status code
    if (error instanceof NotFoundError) {
      let errorResponse: ResponseSchema<"exampleRoute", 404>;
      errorResponse = {
        /* ... */
      };
      return res.status(404).json(error);
    }
    // Pass other errors to Express error handler
    next(error);
  }
});

// In your app.ts file
app.use("/examples", exampleRouter);
```
