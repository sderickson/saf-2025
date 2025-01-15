<script setup lang="ts">
</script>

<template>
  <!-- TODO: Most of this is AI-generated. Clean it up and understand it. -->
  <v-app>
    <!-- Application bar -->
    <v-app-bar color="primary">
      <v-app-bar-title align="left">Product Name</v-app-bar-title>
      <v-btn variant="text">Features</v-btn>
      <v-btn variant="text">Pricing</v-btn>
      <v-btn variant="text">About</v-btn>
      <v-btn color="secondary" variant="flat">Sign In</v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <v-container class="fill-height align-center justify-center">
        <v-row align="center">
          <v-col class="text-center px-0">
            <h1 class="text-h2 font-weight-bold mb-4">
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="bg-grey-lighten-1">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="text-center">
          <v-btn
            v-for="link in ['Home', 'About', 'Services', 'Blog', 'Contact Us']"
            :key="link"
            variant="text"
            class="mx-2 d-sm-inline-block"
            rounded="xl"
          >
            {{ link }}
          </v-btn>
          <v-col class="text-center mt-4">
            {{ new Date().getFullYear() }} — <strong>Your Product</strong>
          </v-col>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-container {
  max-width: 960px;
}
</style>
