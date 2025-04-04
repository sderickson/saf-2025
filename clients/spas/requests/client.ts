import type { paths } from "@saf-2025/specs-apis";
import { createSafClient } from "@saflib/vue-spa";

export const client = createSafClient<paths>("api");
