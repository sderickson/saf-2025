<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :permanent="smAndUp">
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          :to="{ name: 'Dashboard' }"
        ></v-list-item>
        <!-- Users link will be added later -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon
        v-if="!smAndUp"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Admin Portal</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";

// AdminApp.vue - Main app component for the admin SPA
const drawer = ref(false); // Keep drawer open by default for admin
const { smAndUp } = useDisplay();
</script>
