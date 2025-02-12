import { useMutation } from "@tanstack/vue-query";
import { client } from "./client.ts";
import type { RequestSchema } from "@saf/specs-apis";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (body: RequestSchema<"loginUser">) => {
      const { data, error } = await client.POST("/auth/login", { body });
      if (error) {
        throw error;
      }
      return data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await client.POST("/auth/logout");
      if (error) {
        throw error;
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (body: RequestSchema<"registerUser">) => {
      const { data, error } = await client.POST("/auth/register", {
        body,
      });
      if (error) {
        throw error;
      }

      return data;
    },
  });
};
