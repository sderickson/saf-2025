import { useMutation } from "@tanstack/vue-query";
import { client } from "./client.ts";
import type { RequestSchema } from "@saf/specs-apis";

export const useLogin = (body: RequestSchema<"loginUser">) => {
  return useMutation({
    mutationFn: () => client.POST("/api/auth/login", { body }),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => client.POST("/api/auth/logout"),
  });
};

export const useRegister = (body: RequestSchema<"registerUser">) => {
  return useMutation({
    mutationFn: () => client.POST("/auth/register", { body }),
  });
};
