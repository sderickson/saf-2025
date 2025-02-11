# Vue Component Testing Guide

This guide outlines best practices for writing unit tests for Vue components in our project.

## Setup

### Test Environment

We use the following tools for testing:

- Vitest as the test runner
- Vue Test Utils for component testing
- JSDOM for browser environment simulation
- Vuetify for UI components

### Basic Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import YourComponent from "../YourComponent.vue";

const vuetify = createVuetify({
  components,
  directives,
});

describe("YourComponent", () => {
  const mountComponent = () => {
    return mount(YourComponent, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link"], // Stub router components if needed
      },
    });
  };

  // Helper functions for element selection
  const getEmailInput = (wrapper: VueWrapper) => {
    const emailInput = wrapper.find("[placeholder='Email address']");
    expect(emailInput.exists()).toBe(true);
    return emailInput;
  };

  const getSubmitButton = (wrapper: VueWrapper) => {
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Submit");
    return button;
  };

  beforeEach(() => {
    // Clear mocks and reset state
    vi.clearAllMocks();
  });

  // Tests go here
});
```

## Best Practices

### 1. Start with a Render Test

Always begin with a render test that validates your element selection helpers work:

```typescript
it("should render the form", () => {
  const wrapper = mountComponent();
  expect(getEmailInput(wrapper).exists()).toBe(true);
  expect(getPasswordInput(wrapper).exists()).toBe(true);
  expect(getSubmitButton(wrapper).exists()).toBe(true);
});
```

This test serves two purposes:

1. Verifies the component renders correctly
2. Tests your element selection helpers early

### 2. Element Selection Strategy

1. Prefer `wrapper.find()` with specific attributes:

   ```typescript
   // Good - uses placeholder text that's already in the component
   const getEmailInput = (wrapper: VueWrapper) =>
     wrapper.find("[placeholder='Email address']");

   // Good - uses button text that's already in the component
   const getSubmitButton = (wrapper: VueWrapper) => {
     const button = wrapper.find("button");
     expect(button.text()).toBe("Submit");
     return button;
   };

   // Avoid - using test-specific data attributes
   wrapper.find("[data-test='email-input']");
   ```

2. Selection priority (in order of preference):

   - Placeholder text for inputs
   - Button/element text content
   - Component-specific classes (e.g., Vuetify classes)
   - Element type + context
   - Custom data attributes (last resort)

3. Make selection helpers robust:
   ```typescript
   const getInput = (wrapper: VueWrapper, placeholder: string) => {
     const input = wrapper.find(`[placeholder='${placeholder}']`);
     expect(input.exists()).toBe(true);
     return input;
   };
   ```

### 3. Form Interaction Helpers

Create reusable helpers for common form interactions:

```typescript
const fillForm = async (
  wrapper: VueWrapper,
  { email, password }: { email: string; password: string },
) => {
  await getEmailInput(wrapper).setValue(email);
  await getPasswordInput(wrapper).setValue(password);
  await wrapper.vm.$nextTick();
};
```

### 4. Async Testing

1. Always use `async/await` when:

   - Setting input values
   - Triggering events
   - Checking validation messages
   - After any state changes

2. Use a single `$nextTick` after state changes:

   ```typescript
   await input.setValue("value");
   await wrapper.vm.$nextTick();
   expect(wrapper.text()).toContain("Validation message");
   ```

3. Common misconceptions:
   - Multiple `$nextTick` calls are not needed - a single call is sufficient
   - Adding more `$nextTick` calls won't fix timing issues
   - If a test is flaky, look for other causes like missing awaits on events or setValue calls

### 5. Validation Testing

Test validation messages using text content:

```typescript
it("should validate email format", async () => {
  const wrapper = mountComponent();
  const emailInput = getEmailInput(wrapper);

  await emailInput.setValue("invalid-email");
  await wrapper.vm.$nextTick();
  expect(wrapper.text()).toContain("Must be a valid email");

  await emailInput.setValue("valid@email.com");
  await wrapper.vm.$nextTick();
  expect(wrapper.text()).not.toContain("Must be a valid email");
});
```

### 6. Button State Testing

Test button states using attributes:

```typescript
it("should disable submit button when form is invalid", async () => {
  const wrapper = mountComponent();
  const submitButton = getSubmitButton(wrapper);

  // Initially disabled
  expect(submitButton.attributes("disabled")).toBeDefined();

  // After valid input
  await fillForm(wrapper, {
    email: "valid@email.com",
    password: "validpassword123",
  });
  expect(submitButton.attributes("disabled")).toBeUndefined();
});
```

### 7. Mocking External Dependencies

1. Mock at the top of the file:

   ```typescript
   const mockSubmit = vi.fn();
   vi.mock("../path/to/module", () => ({
     useSubmit: () => ({
       mutate: mockSubmit,
       isPending: false,
       isError: false,
     }),
   }));
   ```

2. Reset mocks in `beforeEach`:
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
     mockSubmit.mockReset();
   });
   ```

### 8. Common Gotchas

1. Vuetify Validation:

   - May need multiple `$nextTick` calls
   - Use `wrapper.text()` to check validation messages
   - Button states may depend on form validation

2. Component Mounting:

   - Always include Vuetify setup
   - Stub router components when needed
   - Consider global plugins and providers

3. Async Operations:
   - Always use `async/await`
   - Wait for component updates with `$nextTick`
   - Test both success and error states

## Example Test

```typescript
it("should handle form submission", async () => {
  const wrapper = mountComponent();

  await fillForm(wrapper, {
    email: "test@example.com",
    password: "validpassword123",
  });

  const submitButton = getSubmitButton(wrapper);
  await submitButton.trigger("click");
  await wrapper.vm.$nextTick();

  expect(mockSubmit).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "validpassword123",
  });
});
```
