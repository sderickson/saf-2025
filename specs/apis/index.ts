import type { RequestSchema, ResponseSchema } from "./helpers.ts";
import * as json from "./dist/openapi.json" with { type: "json" };
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.ts";
import type * as types from "./dist/openapi.d.ts";

export const jsonSpec = json as unknown as OpenAPIV3.DocumentV3;

export type { RequestSchema, ResponseSchema, types };
