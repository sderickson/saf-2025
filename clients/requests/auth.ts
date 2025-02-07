import { useMutation } from "@tanstack/vue-query";
import { client } from "./client.ts";
import type { RequestSchema } from "@saf/specs-apis";

export const useLogin = () => {
  return useMutation({
    mutationFn: (body: RequestSchema<"loginUser">) =>
      client.POST("/auth/login", { body }),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => client.POST("/auth/logout"),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (body: RequestSchema<"registerUser">) => {
      const { data, error } = await client.POST("/auth/register", {
        body,
      });
      if (error) {
        console.log(error);
        throw error;
      }

      return data;
    },
  });
};
