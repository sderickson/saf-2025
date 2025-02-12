import { describe, it, expect, vi, beforeEach } from "vitest";
import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useLogin, useLogout, useRegister } from "./auth";
import { client } from "./client";

// Mock the client
vi.mock("./client", () => ({
  client: {
    POST: vi.fn(),
  },
}));

function withVueQuery(composable: () => unknown) {
  let result;
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });

  app.use(VueQueryPlugin, { queryClient });
  app.mount(document.createElement("div"));

  return [result, app] as const;
}

describe("auth requests", () => {
  const mockPOST = client.POST as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPOST.mockClear();
  });

  describe("useLogin", () => {
    const validCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    it("should make a POST request to /auth/login with credentials", async () => {
      const mockResponse = { data: { token: "mock-token" }, error: null };
      mockPOST.mockResolvedValueOnce(mockResponse);

      const [result, app] = withVueQuery(() => useLogin());
      await result.mutateAsync(validCredentials);
      app.unmount();

      expect(mockPOST).toHaveBeenCalledWith("/auth/login", {
        body: validCredentials,
      });
    });

    it("should throw error when request fails", async () => {
      const mockError = { message: "Invalid credentials" };
      mockPOST.mockResolvedValueOnce({ error: mockError });

      const [result, app] = withVueQuery(() => useLogin());
      await expect(result.mutateAsync(validCredentials)).rejects.toEqual(
        mockError,
      );
      app.unmount();
    });
  });

  describe("useLogout", () => {
    it("should make a POST request to /auth/logout", async () => {
      mockPOST.mockResolvedValueOnce({ error: null });

      const [result, app] = withVueQuery(() => useLogout());
      await result.mutateAsync();
      app.unmount();

      expect(mockPOST).toHaveBeenCalledWith("/auth/logout");
    });

    it("should throw error when request fails", async () => {
      const mockError = { message: "Logout failed" };
      mockPOST.mockResolvedValueOnce({ error: mockError });

      const [result, app] = withVueQuery(() => useLogout());
      await expect(result.mutateAsync()).rejects.toEqual(mockError);
      app.unmount();
    });
  });

  describe("useRegister", () => {
    const validRegistration = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    it("should make a POST request to /auth/register with user data", async () => {
      const mockResponse = { data: { token: "mock-token" }, error: null };
      mockPOST.mockResolvedValueOnce(mockResponse);

      const [result, app] = withVueQuery(() => useRegister());
      await result.mutateAsync(validRegistration);
      app.unmount();

      expect(mockPOST).toHaveBeenCalledWith("/auth/register", {
        body: validRegistration,
      });
    });

    it("should throw error when request fails", async () => {
      const mockError = { message: "Registration failed" };
      mockPOST.mockResolvedValueOnce({ error: mockError });

      const [result, app] = withVueQuery(() => useRegister());
      await expect(result.mutateAsync(validRegistration)).rejects.toEqual(
        mockError,
      );
      app.unmount();
    });
  });
});
