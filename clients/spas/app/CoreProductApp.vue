<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Core Product</v-app-bar-title>
      <v-spacer />
      <v-btn href="/auth/logout" prepend-icon="mdi-logout" variant="text">
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
