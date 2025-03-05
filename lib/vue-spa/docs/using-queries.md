# Using TanStack Query in Components

This guide focuses on how to effectively use query and mutation functions in your Vue components. It covers common patterns for handling loading states, errors, and dependent data.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Working with Refs](#working-with-refs)
- [Dependent Queries](#dependent-queries)
- [Using Mutations](#using-mutations)
- [Error Handling](#error-handling)
- [Loading States](#loading-states)
- [UI Patterns](#ui-patterns)

## Basic Usage

Once you've created your query functions (see [Adding Queries](./adding-queries.md)), you can use them in your components:

```vue
<script setup lang="ts">
import { useGetUsers } from "../../requests/users";

// Destructure the result to get data, loading state, and errors
const { data: users, isLoading, error } = useGetUsers();
</script>

<template>
  <div v-if="isLoading">Loading users...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

## Working with Refs

When using queries that require parameters, you'll need to pass refs or computed values:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetUserProfile } from "../../requests/userProfile";

// Create a ref for the userId
const userId = ref(123);

// Or use a computed value that depends on other data
const computedUserId = computed(() => someOtherData.value?.id || -1);

// Pass the ref to the query function
const { data: profile, isLoading } = useGetUserProfile(userId);

// You can also use the computed value
const { data: computedProfile } = useGetUserProfile(computedUserId);
</script>
```

## Dependent Queries

Often, you'll need to fetch data that depends on the results of another query. Use the `enabled` option to control when dependent queries should run:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetUserProfile } from "../../requests/userProfile";
import { useGetUserPosts } from "../../requests/userPosts";
import { useVerifyAuth } from "../../requests/auth";

// First query - get the authenticated user
const {
  data: authData,
  isLoading: isAuthLoading,
  error: authError,
} = useVerifyAuth();

// Create a computed ref for userId
const userId = computed(() => authData.value?.id || -1);

// Only enable the profile query when we have a valid userId
const fetchProfileEnabled = computed(() => userId.value !== -1);

// Second query - depends on userId
const {
  data: profile,
  isLoading: isProfileLoading,
  error: profileError,
} = useGetUserProfile(userId, {
  enabled: fetchProfileEnabled,
});

// Third query - depends on both userId and profile
const fetchPostsEnabled = computed(
  () => userId.value !== -1 && !!profile.value
);

// This query will only run when both userId is valid and profile is loaded
const {
  data: userPosts,
  isLoading: isPostsLoading,
  error: postsError,
} = useGetUserPosts(userId, {
  enabled: fetchPostsEnabled,
});

// Combined loading state
const isLoading = computed(
  () => isAuthLoading.value || isProfileLoading.value || isPostsLoading.value
);
</script>

<template>
  <div v-if="isLoading">Loading data...</div>
  <div v-else-if="authError">Authentication error: {{ authError.message }}</div>
  <div v-else-if="profileError">Profile error: {{ profileError.message }}</div>
  <div v-else-if="postsError">Posts error: {{ postsError.message }}</div>
  <div v-else>
    <!-- Display data when everything is loaded -->
    <user-profile :profile="profile" />
    <user-posts :posts="userPosts" />
  </div>
</template>
```

### Key Points for Dependent Queries

1. Use `computed` properties to derive values from query results
2. Use the `enabled` option to control when queries should run
3. Create a combined loading state for a better user experience
4. Handle errors for each query separately

## Using Mutations

Mutations allow you to update data on the server. Here's how to use them in your components:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from "../../requests/userProfile";
import { useVerifyAuth } from "../../requests/auth";
import type { RequestSchema } from "@tasktap/specs-apis";

// Get the authenticated user's ID
const { data: authData } = useVerifyAuth();
const userId = computed(() => authData.value?.id || -1);

// Get user profile
const { data: profile, isLoading: isProfileLoading } = useGetUserProfile(
  userId,
  {
    enabled: computed(() => userId.value !== -1),
  }
);

// Setup mutation
const updateProfile = useUpdateUserProfile();
const isSaving = computed(() => updateProfile.isPending.value);
const saveError = computed(() => updateProfile.error.value);

// Form data
const editedProfile = ref({});
const isEditMode = ref(false);

// Initialize form when entering edit mode
const enterEditMode = () => {
  editedProfile.value = { ...profile.value };
  isEditMode.value = true;
};

// Cancel editing
const cancelEdit = () => {
  isEditMode.value = false;
  editedProfile.value = {};
};

// Save profile changes
const saveProfile = async () => {
  try {
    await updateProfile.mutateAsync({
      userId,
      profileData: editedProfile.value as RequestSchema<"updateUserProfile">,
    });

    // Reset edit mode on success
    isEditMode.value = false;

    // No need to manually refetch - cache invalidation handles this
  } catch (err) {
    // Error handling is done via the mutation's error state
    console.error("Failed to update profile:", err);
  }
};
</script>

<template>
  <div v-if="isProfileLoading">Loading profile...</div>
  <div v-else-if="profile">
    <!-- View mode -->
    <div v-if="!isEditMode">
      <h1>{{ profile.name }}</h1>
      <p>{{ profile.bio }}</p>
      <button @click="enterEditMode">Edit Profile</button>
    </div>

    <!-- Edit mode -->
    <form v-else @submit.prevent="saveProfile">
      <div v-if="saveError" class="error">Error: {{ saveError.message }}</div>

      <input v-model="editedProfile.name" placeholder="Name" />
      <textarea v-model="editedProfile.bio" placeholder="Bio"></textarea>

      <div class="actions">
        <button type="button" @click="cancelEdit" :disabled="isSaving">
          Cancel
        </button>
        <button type="submit" :disabled="isSaving">
          {{ isSaving ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

### Key Points for Mutations

1. Use `isPending` to show loading state during mutation
2. Handle errors from the mutation
3. Reset UI state after successful mutation
4. No need to manually refetch data - cache invalidation handles this

## Error Handling

Proper error handling is crucial for a good user experience:

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useGetUserProfile } from "../../requests/userProfile";
import { useVerifyAuth } from "../../requests/auth";

// Auth-related data and errors
const {
  data: authData,
  isLoading: isAuthLoading,
  error: authError,
  refetch: refetchAuth,
} = useVerifyAuth();

const userId = computed(() => authData.value?.id || -1);

// Profile-related data and errors
const {
  data: profile,
  isLoading: isProfileLoading,
  error: profileError,
  refetch: refetchProfile,
} = useGetUserProfile(userId, {
  enabled: computed(() => userId.value !== -1),
});

// Combined loading state
const isLoading = computed(() => isAuthLoading.value || isProfileLoading.value);
</script>

<template>
  <!-- Auth error state -->
  <v-alert v-if="authError" type="error" title="Authentication Error">
    You must be logged in to view this page.
    <template #append>
      <v-btn @click="refetchAuth">Retry</v-btn>
      <v-btn to="/login">Login</v-btn>
    </template>
  </v-alert>

  <!-- Loading state -->
  <v-progress-circular
    v-else-if="isLoading"
    indeterminate
  ></v-progress-circular>

  <!-- Profile error state -->
  <v-alert v-else-if="profileError" type="error" title="Error loading profile">
    {{ profileError.message || "Failed to load profile data" }}
    <template #append>
      <v-btn @click="refetchProfile">Retry</v-btn>
    </template>
  </v-alert>

  <!-- Content when data is available -->
  <div v-else-if="profile">
    <!-- Your UI here -->
  </div>
</template>
```

### Error Handling Best Practices

1. Handle different types of errors separately (auth errors, data errors, etc.)
2. Provide clear error messages to the user
3. Offer retry functionality when appropriate
4. Redirect to login for authentication errors

## Loading States

Managing loading states properly improves user experience:

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useGetUserProfile } from "../../requests/userProfile";

const userId = ref(123);

const {
  data: profile,
  isLoading,
  isFetching,
  isError,
  error,
} = useGetUserProfile(userId);

// isFetching is true during any background refetches
// isLoading is only true during the initial load
const showSkeleton = computed(() => isLoading.value);
const showSpinner = computed(() => !isLoading.value && isFetching.value);
</script>

<template>
  <!-- Initial loading - show skeleton -->
  <profile-skeleton v-if="showSkeleton" />

  <!-- Data is loaded but refreshing - show spinner -->
  <div v-else>
    <div v-if="showSpinner" class="refresh-indicator">
      <v-progress-circular size="small" indeterminate></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-alert v-if="isError" type="error">
      {{ error.message }}
    </v-alert>

    <!-- Content -->
    <profile-display v-if="profile" :profile="profile" />
  </div>
</template>
```

### Loading State Types

- `isLoading`: True during the initial load when no data is available
- `isFetching`: True during any data fetching, including background refetches
- `isRefetching`: True when data is being refetched in the background

## UI Patterns

Here are some common UI patterns for working with queries:

### 1. Data Table with Pagination

```vue
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useGetUsers } from "../../requests/users";

const page = ref(1);
const pageSize = ref(10);

const {
  data: usersResponse,
  isLoading,
  error,
  refetch,
} = useGetUsers(
  computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
  }))
);

// Extract users and pagination info
const users = computed(() => usersResponse.value?.items || []);
const totalUsers = computed(() => usersResponse.value?.total || 0);
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));

// Change page
const goToPage = (newPage) => {
  page.value = newPage;
};
</script>

<template>
  <div>
    <v-data-table
      :items="users"
      :loading="isLoading"
      :items-per-page="pageSize"
    >
      <!-- Table columns -->
    </v-data-table>

    <v-pagination
      v-model="page"
      :length="totalPages"
      :disabled="isLoading"
    ></v-pagination>
  </div>
</template>
```

### 2. Infinite Scroll

```vue
<script setup lang="ts">
import { useInfiniteQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { client } from "../../requests/client";

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await client.GET("/posts", {
        params: {
          query: { page: pageParam, limit: 10 },
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage || undefined;
    },
  });

// Flatten the pages into a single array
const posts = computed(() => {
  return data.value?.pages.flatMap((page) => page.items) || [];
});

// Load more function for infinite scroll
const loadMore = () => {
  if (hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
};
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post">
        {{ post.title }}
      </div>

      <div v-if="hasNextPage" class="load-more">
        <button @click="loadMore" :disabled="isFetchingNextPage">
          {{ isFetchingNextPage ? "Loading more..." : "Load more" }}
        </button>
      </div>

      <div v-else class="end-message">No more posts to load</div>
    </div>
  </div>
</template>
```

### 3. Optimistic UI Updates

```vue
<script setup lang="ts">
import { useGetTodos, useToggleTodoStatus } from "../../requests/todos";

const { data: todos } = useGetTodos();
const toggleTodo = useToggleTodoStatus();

const handleToggle = async (todo) => {
  await toggleTodo.mutateAsync({
    todoId: todo.id,
    completed: !todo.completed,
  });
  // No need to refetch - the cache is automatically updated
};
</script>

<template>
  <div>
    <div v-for="todo in todos" :key="todo.id" class="todo-item">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle(todo)"
        :disabled="toggleTodo.isPending.value"
      />
      <span :class="{ completed: todo.completed }">
        {{ todo.title }}
      </span>
    </div>
  </div>
</template>
```

## Conclusion

TanStack Query provides a powerful way to manage server state in your Vue components. By following these patterns, you can create a smooth user experience with proper loading states, error handling, and data updates.

For more information, refer to:

- [Adding Queries Guide](./adding-queries.md) - How to implement query functions
- [Query Testing Guide](./query-testing.md) - How to test your queries
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/vue/overview)
