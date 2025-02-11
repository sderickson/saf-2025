<script setup lang="ts">
import { ref } from "vue";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../../requests/todos";

const newTodoTitle = ref("");
const { data: todos, isLoading } = useTodos();
const { mutate: createTodo } = useCreateTodo();
const { mutate: updateTodo } = useUpdateTodo();
const { mutate: deleteTodo } = useDeleteTodo();

function handleCreateTodo() {
  if (!newTodoTitle.value.trim()) return;
  createTodo({ title: newTodoTitle.value.trim() });
  newTodoTitle.value = "";
}

function toggleTodo(id: number, todo: { title: string; completed: boolean }) {
  updateTodo({
    id,
    todo: { ...todo, completed: !todo.completed },
  });
}

function handleDeleteTodo(id: number) {
  deleteTodo(id);
}
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">Todo List</h1>

    <!-- Add new todo -->
    <v-form class="mb-6" @submit.prevent="handleCreateTodo">
      <v-text-field
        v-model="newTodoTitle"
        label="New Todo"
        placeholder="What needs to be done?"
        hide-details
        @keyup.enter="handleCreateTodo"
      >
        <template #append>
          <v-btn
            color="primary"
            :disabled="!newTodoTitle.trim()"
            icon
            @click="handleCreateTodo"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-form>

    <!-- Loading state -->
    <div v-if="isLoading" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>

    <!-- Todo list -->
    <v-list v-else class="bg-grey-lighten-4 rounded">
      <v-list-item
        v-for="todo in todos"
        :key="todo.id"
        :class="{ 'bg-grey-lighten-3': todo.completed }"
      >
        <template #prepend>
          <v-checkbox
            v-model="todo.completed"
            hide-details
            @change="toggleTodo(todo.id, todo)"
          />
        </template>

        <v-list-item-title
          :class="{ 'text-decoration-line-through': todo.completed }"
        >
          {{ todo.title }}
        </v-list-item-title>

        <template #append>
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            size="small"
            @click="handleDeleteTodo(todo.id)"
          />
        </template>
      </v-list-item>

      <v-list-item v-if="todos?.length === 0">
        <v-list-item-title class="text-center text-grey">
          No todos yet. Add one above!
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped></style>
