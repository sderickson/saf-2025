import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { requestId } from "./requestId.js";

describe("requestId middleware", () => {
  it("should add a request ID to the request object", () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    requestId(req, res, next);

    expect(req.id).toBeDefined();
    expect(req.id).toHaveLength(8);
    expect(next).toHaveBeenCalled();
  });

  it("should generate unique IDs for different requests", () => {
    const req1 = {} as Request;
    const req2 = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    requestId(req1, res, next);
    requestId(req2, res, next);

    expect(req1.id).not.toBe(req2.id);
  });
});
