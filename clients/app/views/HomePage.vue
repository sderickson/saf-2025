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

function toggleTodo(id: string, todo: { title: string; completed: boolean }) {
  updateTodo({
    id,
    todo: { ...todo, completed: !todo.completed },
  });
}

function handleDeleteTodo(id: string) {
  deleteTodo(id);
}
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">Todo List</h1>

    <!-- Add new todo -->
    <v-form @submit.prevent="handleCreateTodo" class="mb-6">
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-text-field
            v-model="newTodoTitle"
            label="New Todo"
            placeholder="What needs to be done?"
            hide-details
            @keyup.enter="handleCreateTodo"
          >
            <template v-slot:append>
              <v-btn
                color="primary"
                @click="handleCreateTodo"
                :disabled="!newTodoTitle.trim()"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
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
        <template v-slot:prepend>
          <v-checkbox
            v-model="todo.completed"
            @change="toggleTodo(todo.id, todo)"
            hide-details
          />
        </template>

        <v-list-item-title
          :class="{ 'text-decoration-line-through': todo.completed }"
        >
          {{ todo.title }}
        </v-list-item-title>

        <template v-slot:append>
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="handleDeleteTodo(todo.id)"
            size="small"
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

<style scoped>
.v-list {
  max-width: 800px;
  margin: 0 auto;
}
</style>
