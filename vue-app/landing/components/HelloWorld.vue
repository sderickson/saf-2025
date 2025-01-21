<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);

import createClient from "openapi-fetch";
import type { paths } from "api-spec/dist/openapi";

async function testClient() {
  const client = createClient<paths>({ baseUrl: "http://localhost:3000/" });
  {
    const { data, error } = await client.POST("/users", {
      body: {
        email: "test" + (Math.random() * 100000).toFixed() + "@gmail.com",
        name: "tester",
      },
    });
    console.log({ data, error });
  }
  {
    const { data, error } = await client.GET("/users");
    console.log({ data, error });
  }
}
testClient();
</script>

<template>
  <h1>{{ msg }}</h1>

  <v-chip color="primary"> Chip: Vuetify is working </v-chip>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
