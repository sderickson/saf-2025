import type { operations } from "@saf/specs-apis/dist/openapi.js";

export type ResponseSchema<
  O extends keyof operations,
  S extends keyof operations[O]["responses"],
> = operations[O]["responses"][S] extends {
  content: { "application/json": any };
}
  ? operations[O]["responses"][S]["content"]["application/json"]
  : never;

export type RequestSchema<O extends keyof operations> =
  operations[O]["requestBody"] extends { content: { "application/json": any } }
    ? operations[O]["requestBody"]["content"]["application/json"]
    : never;
