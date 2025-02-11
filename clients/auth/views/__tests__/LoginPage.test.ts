import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, type VueWrapper, type DOMWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import LoginPage from "../LoginPage.vue";

const mockMutate = vi.fn();

// Mock the auth request
vi.mock("../../../requests/auth", () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isError: false,
    error: null,
    isPending: false,
  }),
}));

const vuetify = createVuetify({
  components,
  directives,
});

describe("LoginPage", () => {
  const mountLoginPage = () => {
    return mount(LoginPage, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link"],
      },
    });
  };

  beforeEach(() => {
    mockMutate.mockClear();
  });

  // Helper functions to get elements
  const getInputByLabel = (wrapper: VueWrapper, label: string) => {
    const field = wrapper
      .findAll(".v-field")
      .find(
        (field: DOMWrapper<HTMLElement>) =>
          field.find("label").text() === label,
      );
    return field?.find("input");
  };

  const getEmailInput = (wrapper: VueWrapper) =>
    getInputByLabel(wrapper, "Email address");

  const getPasswordInput = (wrapper: VueWrapper) =>
    getInputByLabel(wrapper, "Password");

  const getLoginButton = (wrapper: VueWrapper) =>
    wrapper
      .findAll("button")
      .find((btn: DOMWrapper<HTMLButtonElement>) => btn.text() === "Log In");

  const fillLoginForm = async (
    wrapper: VueWrapper,
    email: string,
    password: string,
  ) => {
    const emailInput = getEmailInput(wrapper);
    const passwordInput = getPasswordInput(wrapper);

    await emailInput?.setValue(email);
    await passwordInput?.setValue(password);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for Vuetify validation
  };

  it("login button should be disabled when form is invalid", async () => {
    const wrapper = mountLoginPage();

    // Initially the form should be invalid (empty fields)
    await wrapper.vm.$nextTick();
    const loginButton = getLoginButton(wrapper);
    expect(loginButton?.element.hasAttribute("disabled")).toBe(true);

    // Set invalid email
    await fillLoginForm(wrapper, "invalid-email", "password123");
    expect(loginButton?.element.hasAttribute("disabled")).toBe(true);

    // Set valid email but short password
    await fillLoginForm(wrapper, "test@example.com", "short");
    expect(loginButton?.element.hasAttribute("disabled")).toBe(true);

    // Set valid email and valid password
    await fillLoginForm(wrapper, "test@example.com", "validpassword123");
    expect(loginButton?.element.hasAttribute("disabled")).toBe(false);
  });

  it("should call login function with credentials when form is submitted", async () => {
    const wrapper = mountLoginPage();
    const loginButton = getLoginButton(wrapper);

    // Fill in valid credentials
    await fillLoginForm(wrapper, "test@example.com", "validpassword123");

    // Click login button
    await loginButton?.trigger("click");

    // Verify the login function was called with correct credentials
    expect(mockMutate).toHaveBeenCalledWith(
      { email: "test@example.com", password: "validpassword123" },
      expect.any(Object),
    );
  });
});
