import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import RegisterPage from "../RegisterPage.vue";
const mockRegister = vi.fn();
let mockIsPending = false;
let mockIsError = false;
let mockError: { message: string } | null = null;
let mockIsSuccess = false;

// Mock the useRegister hook
vi.mock("../../../requests/auth", () => ({
  useRegister: () => ({
    mutate: mockRegister,
    isPending: mockIsPending,
    isError: mockIsError,
    error: mockError,
    isSuccess: mockIsSuccess,
  }),
}));

const vuetify = createVuetify({
  components,
  directives,
});

describe("RegisterPage", () => {
  const mountComponent = () => {
    return mount(RegisterPage, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link"],
      },
    });
  };

  // Helper functions
  const getEmailInput = (wrapper: VueWrapper) => {
    const emailInput = wrapper.find("[placeholder='Email address']");
    expect(emailInput.exists()).toBe(true);
    return emailInput;
  };

  const getPasswordInput = (wrapper: VueWrapper) => {
    const passwordInput = wrapper.find("[placeholder='Enter your password']");
    expect(passwordInput.exists()).toBe(true);
    return passwordInput;
  };

  const getConfirmPasswordInput = (wrapper: VueWrapper) => {
    const confirmPasswordInput = wrapper.find(
      "[placeholder='Confirm your password']",
    );
    expect(confirmPasswordInput.exists()).toBe(true);
    return confirmPasswordInput;
  };

  const getRegisterButton = (wrapper: VueWrapper) => {
    const registerButton = wrapper.find("button");
    expect(registerButton.exists()).toBe(true);
    expect(registerButton.text()).toBe("Register");
    return registerButton;
  };

  const fillRegisterForm = async (
    wrapper: VueWrapper,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    await getEmailInput(wrapper)?.setValue(email);
    await getPasswordInput(wrapper)?.setValue(password);
    await getConfirmPasswordInput(wrapper)?.setValue(confirmPassword);
    await wrapper.vm.$nextTick();
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockReset();
    mockIsPending = false;
    mockIsError = false;
    mockError = null;
    mockIsSuccess = false;
  });

  it("should render the register form", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();
    expect(getEmailInput(wrapper).exists()).toBe(true);
    expect(getPasswordInput(wrapper).exists()).toBe(true);
    expect(getConfirmPasswordInput(wrapper).exists()).toBe(true);
    expect(getRegisterButton(wrapper).exists()).toBe(true);
  });

  it("should validate email format", async () => {
    const wrapper = mountComponent();
    const emailInput = getEmailInput(wrapper);

    await emailInput.setValue("invalid-email");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Email must be valid");

    await emailInput.setValue("valid@email.com");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain("Email must be valid");
  });

  it("should validate password requirements", async () => {
    const wrapper = mountComponent();
    const emailInput = getEmailInput(wrapper);
    await emailInput.setValue("valid@email.com");
    await wrapper.vm.$nextTick();

    const passwordInput = getPasswordInput(wrapper);

    await passwordInput.setValue("short");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Password must be at least");

    await passwordInput.setValue("validpassword123");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain("Password must be at least");
  });

  it("should validate password confirmation match", async () => {
    const wrapper = mountComponent();

    await fillRegisterForm(
      wrapper,
      "test@example.com",
      "password123",
      "different-password",
    );
    expect(wrapper.text()).toContain("Passwords must match");

    await fillRegisterForm(
      wrapper,
      "test@example.com",
      "password123",
      "password123",
    );
    expect(wrapper.text()).not.toContain("Passwords must match");
  });

  it("should toggle password visibility", async () => {
    const wrapper = mountComponent();
    const passwordInput = getPasswordInput(wrapper);
    const visibilityIcon = wrapper.find(".mdi-eye");

    expect(passwordInput.attributes("type")).toBe("password");

    await visibilityIcon.trigger("click");
    await wrapper.vm.$nextTick();

    expect(passwordInput.attributes("type")).toBe("text");
  });

  it("should disable register button when form is invalid", async () => {
    const wrapper = mountComponent();
    const registerButton = getRegisterButton(wrapper);

    // Initially button should be disabled
    expect(registerButton.attributes("disabled")).toBeDefined();

    // With invalid data
    await fillRegisterForm(wrapper, "invalid-email", "pass", "different");
    expect(registerButton.attributes("disabled")).toBeDefined();

    // With valid data
    await fillRegisterForm(
      wrapper,
      "test@example.com",
      "validpassword123",
      "validpassword123",
    );
    expect(registerButton.attributes("disabled")).toBeUndefined();
  });

  it("should handle successful registration", async () => {
    mockIsSuccess = true;
    const wrapper = mountComponent();
    await fillRegisterForm(
      wrapper,
      "test@example.com",
      "validpassword123",
      "validpassword123",
    );

    await getRegisterButton(wrapper).trigger("click");

    expect(mockRegister).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "validpassword123",
    });
  });

  it("should display error message on registration failure", async () => {
    mockIsError = true;
    mockError = { message: "Registration failed" };

    const wrapper = mountComponent();
    await fillRegisterForm(
      wrapper,
      "test@example.com",
      "validpassword123",
      "validpassword123",
    );

    await getRegisterButton(wrapper).trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Registration failed");
  });
});
