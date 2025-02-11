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
import { mount, type VueWrapper, type DOMWrapper } from "@vue/test-utils";
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

  beforeEach(() => {
    // Clear mocks and reset state
  });

  // Tests go here
});
```

## Best Practices

### 1. Helper Functions for Element Selection

Create helper functions to encapsulate element selection logic. This makes tests more maintainable and readable:

```typescript
// Helper functions to get elements
const getInputByLabel = (wrapper: VueWrapper, label: string) => {
  const field = wrapper
    .findAll(".v-field")
    .find((field: DOMWrapper<Element>) => field.find("label").text() === label);
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
```

### 2. Element Selection Strategy

1. Prefer using labels and text content over data-test attributes:

   - Use button text: `btn.text() === "Log In"`
   - Use input labels: `field.find("label").text() === "Email address"`
   - This approach makes tests more resilient to implementation changes and better reflects how users interact with the UI

2. When using Vuetify components:
   - Use Vuetify's class selectors (e.g., `.v-field`) for structural elements
   - Combine with text content for specific element identification
   - Take advantage of Vuetify's built-in ARIA attributes

### 3. Type Safety

1. Always type your wrapper and element references:

   ```typescript
   type VueWrapper // For component wrappers
   type DOMWrapper<Element> // For general elements
   type DOMWrapper<HTMLButtonElement> // For specific HTML elements
   ```

2. Use proper typing for component props and emits in test files

### 4. Form Interaction Helpers

Create helper functions for common form interactions:

```typescript
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
  // Wait for Vuetify validation
  await new Promise((resolve) => setTimeout(resolve, 0));
};
```

### 5. Async Testing

1. Always use `async/await` when dealing with:

   - Form interactions
   - Component updates
   - Vuetify validations
   - API calls

2. Handle Vue's reactivity system:
   ```typescript
   await wrapper.vm.$nextTick();
   ```

### 6. Mocking

1. Mock external dependencies:

   ```typescript
   vi.mock("../path/to/module", () => ({
     useFeature: () => ({
       someMethod: vi.fn(),
       someState: false,
     }),
   }));
   ```

2. Clear mocks in `beforeEach`:
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
   });
   ```

### 7. Common Gotchas

1. Vuetify Validation Timing:

   - Add small delays after form interactions to allow validation to complete
   - Use `await new Promise((resolve) => setTimeout(resolve, 0))`

2. Component Mounting:

   - Always include necessary Vuetify setup
   - Stub router components when needed
   - Consider global plugins and providers

3. Type Errors:
   - Ensure proper imports from '@vue/test-utils'
   - Use specific HTML element types when working with DOM elements
   - Type component props and emits properly

## Example Test

```typescript
it("login button should be disabled when form is invalid", async () => {
  const wrapper = mountComponent();

  // Initially the form should be invalid (empty fields)
  await wrapper.vm.$nextTick();
  const loginButton = getLoginButton(wrapper);
  expect(loginButton?.element.hasAttribute("disabled")).toBe(true);

  // Test with invalid input
  await fillLoginForm(wrapper, "invalid-email", "password123");
  expect(loginButton?.element.hasAttribute("disabled")).toBe(true);

  // Test with valid input
  await fillLoginForm(wrapper, "test@example.com", "validpassword123");
  expect(loginButton?.element.hasAttribute("disabled")).toBe(false);
});
```
