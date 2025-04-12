<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :permanent="smAndUp">
      <v-list>
        <!-- TODO: fix this. Vuetify does not do it correctly automatically, seems confused by vue-router nesting -->
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          :active="false"
          :to="{ name: 'Dashboard' }"
        ></v-list-item>
        <v-list-item
          :active="false"
          prepend-icon="mdi-account-group"
          title="Users"
          :to="{ name: 'Users' }"
        ></v-list-item>
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

const { smAndUp } = useDisplay();
const drawer = ref(smAndUp.value);
</script>
