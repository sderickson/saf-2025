import { beforeAll } from "vitest";
import "vuetify/styles";

beforeAll(() => {
  // Create a mock style tag to handle Vuetify styles
  const style = document.createElement("style");
  style.setAttribute("test-style", "");
  document.head.append(style);
});
