import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  withResizeObserverMock,
  mountWithPlugins,
} from "@saflib/vue-spa-dev/components.ts";
import HomePage from "./HomePage.vue";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useDeleteAllTodos,
} from "../../requests/todos.ts";
import { VueWrapper } from "@vue/test-utils";
import { router } from "../router.ts";
import {
  VBtn,
  VList,
  VListItem,
  VCheckbox,
  VTextField,
  VProgressCircular,
} from "vuetify/components";
// import { Todo } from "../../requests/types";

console.log(
  "importing todos",
  useDeleteAllTodos,
  useDeleteTodo,
  useUpdateTodo,
  useCreateTodo,
);

// Create mock functions at the top level
const mockCreateTodoMutate = vi.fn();
const mockUpdateTodoMutate = vi.fn();
const mockDeleteTodoMutate = vi.fn();
const mockDeleteAllTodosMutate = vi.fn();

// Mock the todo queries
vi.mock("../../requests/todos", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("../../requests/todos.ts")>();
  console.log("original", original);
  return {
    ...original,
    useTodos: vi.fn(),
    useCreateTodo: () => ({
      mutate: mockCreateTodoMutate,
      isPending: { value: false },
      isError: { value: false },
    }),
    useUpdateTodo: () => ({
      mutate: mockUpdateTodoMutate,
      isPending: { value: false },
      isError: { value: false },
    }),
    useDeleteTodo: () => ({
      mutate: mockDeleteTodoMutate,
      isPending: { value: false },
      isError: { value: false },
    }),
    useDeleteAllTodos: () => ({
      mutate: mockDeleteAllTodosMutate,
      isPending: { value: false },
      isError: { value: false },
    }),
  };
});

withResizeObserverMock(() => {
  describe("HomePage", () => {
    // Helper functions for element selection
    const getNewTodoInput = (wrapper: VueWrapper) => {
      const input = wrapper.findComponent(VTextField);
      expect(input.exists()).toBe(true);
      return input;
    };

    const getAddButton = (wrapper: VueWrapper) => {
      const button = wrapper.findComponent(VBtn);
      expect(button.exists()).toBe(true);
      return button;
    };

    const getDeleteAllButton = (wrapper: VueWrapper) => {
      const buttons = wrapper.findAllComponents(VBtn);
      const deleteButton = buttons.find(
        (btn) => btn.props("color") === "error",
      );
      expect(deleteButton?.exists()).toBe(true);
      return deleteButton;
    };

    const getTodoList = (wrapper: VueWrapper) => {
      const list = wrapper.findComponent(VList);
      expect(list.exists()).toBe(true);
      return list;
    };

    const getTodoItems = (wrapper: VueWrapper) => {
      return wrapper.findAllComponents(VListItem);
    };

    const getTodoCheckbox = (wrapper: VueWrapper, index: number) => {
      const checkbox = getTodoItems(wrapper)[index].findComponent(VCheckbox);
      expect(checkbox.exists()).toBe(true);
      return checkbox;
    };

    const getTodoDeleteButton = (wrapper: VueWrapper, index: number) => {
      const buttons = getTodoItems(wrapper)[index].findAllComponents(VBtn);
      const deleteButton = buttons.find(
        (btn) => btn.props("icon") === "mdi-delete",
      );
      expect(deleteButton?.exists()).toBe(true);
      return deleteButton;
    };

    const mountComponent = () => {
      return mountWithPlugins(HomePage, {}, { router });
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render the todo list page", () => {
      vi.mocked(useTodos).mockReturnValue({
        data: { value: [] },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      expect(wrapper.find("h1").text()).toBe("Todo List");
      expect(getNewTodoInput(wrapper).exists()).toBe(true);
      expect(getAddButton(wrapper).exists()).toBe(true);
    });

    it("should show loading state", () => {
      vi.mocked(useTodos).mockReturnValue({
        data: { value: undefined },
        isLoading: { value: true },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      expect(wrapper.findComponent(VProgressCircular).exists()).toBe(true);
    });

    it("should show empty state when no todos", () => {
      vi.mocked(useTodos).mockReturnValue({
        data: { value: [] },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      expect(getTodoList(wrapper).text()).toContain(
        "No todos yet. Add one above!",
      );
      expect(getDeleteAllButton(wrapper).exists()).toBe(false);
    });

    it("should show todos and delete all button when todos exist", () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo 1",
          completed: false,
          createdAt: "2024-03-28T00:00:00Z",
        },
        {
          id: 2,
          title: "Test Todo 2",
          completed: true,
          createdAt: "2024-03-28T00:00:00Z",
        },
      ];

      vi.mocked(useTodos).mockReturnValue({
        data: { value: mockTodos },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      const todoItems = getTodoItems(wrapper);
      expect(todoItems).toHaveLength(2);
      expect(todoItems[0].text()).toContain("Test Todo 1");
      expect(todoItems[1].text()).toContain("Test Todo 2");
      expect(getDeleteAllButton(wrapper).exists()).toBe(true);
    });

    it("should create a new todo", async () => {
      vi.mocked(useTodos).mockReturnValue({
        data: { value: [] },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      const input = getNewTodoInput(wrapper);
      const addButton = getAddButton(wrapper);

      await input.setValue("New Todo");
      await wrapper.vm.$nextTick();
      expect(addButton.props("disabled")).toBe(false);

      await addButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(mockCreateTodoMutate).toHaveBeenCalledWith({ title: "New Todo" });
      // expect((input.element as HTMLInputElement).value).toBe("");
    });

    it("should toggle todo completion", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo",
          completed: false,
          createdAt: "2024-03-28T00:00:00Z",
        },
      ];
      vi.mocked(useTodos).mockReturnValue({
        data: { value: mockTodos },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      const checkbox = getTodoCheckbox(wrapper, 0);

      await checkbox.trigger("change");
      await wrapper.vm.$nextTick();
      expect(mockUpdateTodoMutate).toHaveBeenCalledWith({
        id: 1,
        todo: { title: "Test Todo", completed: true },
      });
    });

    it("should delete a todo", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo",
          completed: false,
          createdAt: "2024-03-28T00:00:00Z",
        },
      ];
      vi.mocked(useTodos).mockReturnValue({
        data: { value: mockTodos },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      const deleteButton = getTodoDeleteButton(wrapper, 0);

      await deleteButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(mockDeleteTodoMutate).toHaveBeenCalledWith(1);
    });

    it("should delete all todos", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo 1",
          completed: false,
          createdAt: "2024-03-28T00:00:00Z",
        },
        {
          id: 2,
          title: "Test Todo 2",
          completed: true,
          createdAt: "2024-03-28T00:00:00Z",
        },
      ];
      vi.mocked(useTodos).mockReturnValue({
        data: { value: mockTodos },
        isLoading: { value: false },
        isError: { value: false },
      } as any);

      const wrapper = mountComponent();
      const deleteAllButton = getDeleteAllButton(wrapper);

      await deleteAllButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(mockDeleteAllTodosMutate).toHaveBeenCalled();
    });
  });
});
