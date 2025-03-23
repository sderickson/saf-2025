import type { RequestSchema } from "@saf-2025/ts-openapi";

export type LoginRequest = RequestSchema<"loginUser">;
export type RegisterRequest = RequestSchema<"registerUser">;
