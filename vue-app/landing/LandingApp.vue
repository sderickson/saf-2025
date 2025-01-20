<script setup lang="ts">
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title align="left">Product Name</v-app-bar-title>
      <v-btn variant="text">Features</v-btn>
      <v-btn variant="text">Pricing</v-btn>
      <v-btn variant="text">About</v-btn>
      <v-btn
        color="secondary"
        variant="flat"
        class="mr-5"
      >
        Sign In
      </v-btn>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center text-center">
      <div>
        <h1 class="text-h2 font-weight-bold mb-4">
          <v-icon icon="mdi-home" />
          Your Amazing Product
        </h1>
        <p class="text-h5 mb-8">
          A revolutionary solution that helps you achieve amazing things
        </p>
        <v-btn
          color="primary"
          size="x-large"
          rounded="pill"
          class="text-uppercase"
        >
          Get Started Free
        </v-btn>
      </div>
    </v-main>

    <v-footer class="flex-0-0 bg-grey-lighten-1 d-flex flex-column">
      <div>
        <v-btn
          v-for="link in ['Home', 'About', 'Services', 'Blog', 'Contact Us']"
          :key="link"
          variant="text"
          class="mx-2 d-sm-inline-block"
          rounded="xl"
        >
          {{ link }}
        </v-btn>
      </div>
      <div>
        {{ new Date().getFullYear() }} — <strong>Your Product</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
</style>
