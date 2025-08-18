<script setup lang="ts">
const currentDomain = document.location.hostname;
const protocol = document.location.protocol;
const docsLink = `${protocol}//docs.${currentDomain}/`;
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title align="left">SAF Demo Site</v-app-bar-title>
      <v-btn :href="docsLink" variant="text">Docs</v-btn>
      <v-btn href="https://github.com/sderickson/saf-2025" variant="text">
        Src
        <v-icon icon="mdi-github" class="ml-1" />
      </v-btn>
      <v-btn href="https://github.com/sderickson/saflib" variant="text">
        Lib
        <v-icon icon="mdi-github" class="ml-1" />
      </v-btn>
      <v-btn href="https://github.com/sderickson/saf-template" variant="text">
        Template
        <v-icon icon="mdi-github" class="ml-1" />
      </v-btn>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center text-center">
      <div>
        <h1 class="text-h2 font-weight-bold mb-4">
          <v-icon icon="mdi-home" />
          SAF Demo Site
        </h1>
        <p class="text-h5 mb-8">
          For demonstrating and testing SAF library features
        </p>
        <v-btn
          color="primary"
          size="x-large"
          rounded="pill"
          class="text-uppercase"
          :href="docsLink"
        >
          Learn More
        </v-btn>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
