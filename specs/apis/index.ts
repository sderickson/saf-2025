// types
import type { operations } from "./dist/openapi.d.ts";
export type { paths, components, operations } from "./dist/openapi.d.ts";
import type {
  ExtractResponseSchema,
  ExtractRequestSchema,
} from "@saflib/openapi-specs";
export type ApiRequestSchema = ExtractRequestSchema<operations>;
export type ApiResponseSchema = ExtractResponseSchema<operations>;

// json
import * as json from "./dist/openapi.json" with { type: "json" };
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.ts";
export const jsonSpec = (json as any).default as OpenAPIV3.DocumentV3;
