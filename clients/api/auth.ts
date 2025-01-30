import { useMutation } from "@tanstack/vue-query";
// import { client } from "vue-app/client";

export const useLogin = () => {
  return useMutation({
    // mutationFn: (data) => client.POST("/login", { body: data }),
  });
};
