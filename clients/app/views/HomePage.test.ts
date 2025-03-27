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
} from "../../requests/todos";
import { VueWrapper } from "@vue/test-utils";
import { router } from "../router.ts";
import { VBtn } from "vuetify/components";
// import { Todo } from "../../requests/types";

// Mock the todo queries
vi.mock("../../requests/todos.ts", () => ({
  useTodos: vi.fn(),
  useCreateTodo: () => {
    return {
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
    };
  },
  useUpdateTodo: () => {
    return {
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
    };
  },
  useDeleteTodo: () => {
    return {
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
    };
  },
  useDeleteAllTodos: () => {
    return {
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
    };
  },
}));

withResizeObserverMock(() => {
  describe("HomePage", () => {
    // Helper functions for element selection
    const getNewTodoInput = (wrapper: VueWrapper) => {
      const input = wrapper.find("[placeholder='What needs to be done?']");
      expect(input.exists()).toBe(true);
      return input;
    };

    const getAddButton = (wrapper: VueWrapper) => {
      // console.log("wrapper", wrapper.html());
      const button = wrapper.findComponent(VBtn);
      expect(button.exists()).toBe(true);
      return button;
    };

    const getDeleteAllButton = (wrapper: VueWrapper) => {
      const button = wrapper.find("button[color='error']");
      expect(button.exists()).toBe(true);
      return button;
    };

    const getTodoList = (wrapper: VueWrapper) => {
      const list = wrapper.find("v-list");
      expect(list.exists()).toBe(true);
      return list;
    };

    const getTodoItems = (wrapper: VueWrapper) => {
      return wrapper.findAll("v-list-item");
    };

    const getTodoCheckbox = (wrapper: VueWrapper, index: number) => {
      const checkbox = getTodoItems(wrapper)[index].find("v-checkbox");
      expect(checkbox.exists()).toBe(true);
      return checkbox;
    };

    const getTodoDeleteButton = (wrapper: VueWrapper, index: number) => {
      const button = getTodoItems(wrapper)[index].find(
        "button[icon='mdi-delete']",
      );
      expect(button.exists()).toBe(true);
      return button;
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
        isLoading: false,
        isError: false,
      });
      const wrapper = mountComponent();
      expect(wrapper.find("h1").text()).toBe("Todo List");
      expect(getNewTodoInput(wrapper).exists()).toBe(true);
      expect(getAddButton(wrapper).exists()).toBe(true);
    });

    // it("should show loading state", () => {
    //   vi.mocked(useTodos).mockReturnValue({
    //     data: undefined,
    //     isLoading: true,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   expect(wrapper.find("v-progress-circular").exists()).toBe(true);
    // });

    // it("should show empty state when no todos", () => {
    //   vi.mocked(useTodos).mockReturnValue({
    //     data: [],
    //     isLoading: false,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   expect(getTodoList(wrapper).text()).toContain(
    //     "No todos yet. Add one above!",
    //   );
    //   expect(getDeleteAllButton(wrapper).exists()).toBe(false);
    // });

    // it("should show todos and delete all button when todos exist", () => {
    //   const mockTodos: Todo[] = [
    //     { id: 1, title: "Test Todo 1", completed: false },
    //     { id: 2, title: "Test Todo 2", completed: true },
    //   ];

    //   vi.mocked(useTodos).mockReturnValue({
    //     data: mockTodos,
    //     isLoading: false,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   const todoItems = getTodoItems(wrapper);
    //   expect(todoItems).toHaveLength(2);
    //   expect(todoItems[0].text()).toContain("Test Todo 1");
    //   expect(todoItems[1].text()).toContain("Test Todo 2");
    //   expect(getDeleteAllButton(wrapper).exists()).toBe(true);
    // });

    // it("should create a new todo", async () => {
    //   const mockCreateTodo = vi.fn();
    //   vi.mocked(useCreateTodo).mockReturnValue({
    //     mutate: mockCreateTodo,
    //   } as ReturnType<typeof useCreateTodo>);

    //   const wrapper = mountComponent();
    //   const input = getNewTodoInput(wrapper);
    //   const addButton = getAddButton(wrapper);

    //   await input.setValue("New Todo");
    //   await wrapper.vm.$nextTick();
    //   expect(addButton.attributes("disabled")).toBeUndefined();

    //   await addButton.trigger("click");
    //   await wrapper.vm.$nextTick();
    //   expect(mockCreateTodo).toHaveBeenCalledWith({ title: "New Todo" });
    //   expect((input.element as HTMLInputElement).value).toBe("");
    // });

    // it("should toggle todo completion", async () => {
    //   const mockUpdateTodo = vi.fn();
    //   vi.mocked(useUpdateTodo).mockReturnValue({
    //     mutate: mockUpdateTodo,
    //   } as ReturnType<typeof useUpdateTodo>);

    //   const mockTodos: Todo[] = [
    //     { id: 1, title: "Test Todo", completed: false },
    //   ];
    //   vi.mocked(useTodos).mockReturnValue({
    //     data: mockTodos,
    //     isLoading: false,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   const checkbox = getTodoCheckbox(wrapper, 0);

    //   await checkbox.trigger("change");
    //   await wrapper.vm.$nextTick();
    //   expect(mockUpdateTodo).toHaveBeenCalledWith({
    //     id: 1,
    //     todo: { title: "Test Todo", completed: true },
    //   });
    // });

    // it("should delete a todo", async () => {
    //   const mockDeleteTodo = vi.fn();
    //   vi.mocked(useDeleteTodo).mockReturnValue({
    //     mutate: mockDeleteTodo,
    //   } as ReturnType<typeof useDeleteTodo>);

    //   const mockTodos: Todo[] = [
    //     { id: 1, title: "Test Todo", completed: false },
    //   ];
    //   vi.mocked(useTodos).mockReturnValue({
    //     data: mockTodos,
    //     isLoading: false,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   const deleteButton = getTodoDeleteButton(wrapper, 0);

    //   await deleteButton.trigger("click");
    //   await wrapper.vm.$nextTick();
    //   expect(mockDeleteTodo).toHaveBeenCalledWith(1);
    // });

    // it("should delete all todos", async () => {
    //   const mockDeleteAllTodos = vi.fn();
    //   vi.mocked(useDeleteAllTodos).mockReturnValue({
    //     mutate: mockDeleteAllTodos,
    //   } as ReturnType<typeof useDeleteAllTodos>);

    //   const mockTodos: Todo[] = [
    //     { id: 1, title: "Test Todo 1", completed: false },
    //     { id: 2, title: "Test Todo 2", completed: true },
    //   ];
    //   vi.mocked(useTodos).mockReturnValue({
    //     data: mockTodos,
    //     isLoading: false,
    //   } as ReturnType<typeof useTodos>);

    //   const wrapper = mountComponent();
    //   const deleteAllButton = getDeleteAllButton(wrapper);

    //   await deleteAllButton.trigger("click");
    //   await wrapper.vm.$nextTick();
    //   expect(mockDeleteAllTodos).toHaveBeenCalled();
    // });
  });
});
