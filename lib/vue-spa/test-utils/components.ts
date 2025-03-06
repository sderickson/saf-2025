import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mount } from "@vue/test-utils";
import { Component } from "vue";
import { beforeAll, afterAll } from "vitest";

/**
 * Creates a Vuetify instance for testing
 * @returns A Vuetify instance
 */
export function createTestVuetify() {
  return createVuetify({
    components,
    directives,
  });
}

/**
 * Mock implementation of ResizeObserver for testing
 */
export class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

/**
 * Sets up ResizeObserver mock for tests
 * Should be called in beforeAll
 */
export function setupResizeObserverMock() {
  // We need to check if ResizeObserver exists to avoid overriding it if it's already defined
  if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = ResizeObserverMock;
  }
}

/**
 * Tears down ResizeObserver mock after tests
 * Should be called in afterAll
 */
export function teardownResizeObserverMock() {
  // Only delete if it's our mock implementation
  if (global.ResizeObserver === ResizeObserverMock) {
    delete global.ResizeObserver;
  }
}

/**
 * Helper function to setup and teardown ResizeObserver mock in a describe block
 * @param callback - The test suite function
 */
export function withResizeObserverMock(callback: () => void) {
  beforeAll(() => {
    setupResizeObserverMock();
  });

  callback();

  afterAll(() => {
    teardownResizeObserverMock();
  });
}

/**
 * Helper function to mount a component with Vuetify
 * @param component - The component to mount
 * @param options - Mount options
 * @returns The mounted component wrapper
 */
export function mountWithVuetify(component: Component, options: any = {}) {
  const vuetify = createTestVuetify();

  return mount(component, {
    ...options,
    global: {
      plugins: [vuetify],
      ...(options.global || {}),
    },
  });
}
