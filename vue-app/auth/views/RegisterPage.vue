<script setup lang="ts">
import { ref } from "vue";
const passwordVisible = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const valid = ref(null);

const emailRules = [
  (value: string) => !!value || "Email is required",
  (value: string) => /.+@.+\..+/.test(value) || "Email must be valid",
];

const passwordRules = [
  (value: string) => !!value || "Password is required",
  (value: string) =>
    value.length >= 8 || "Password must be at least 8 characters",
];

const confirmPasswordRules = [
  (value: string) => !!value || "Please confirm your password",
  (value: string) => value === password.value || "Passwords must match",
];

const register = () => {
  console.log("register", email.value, password.value, { valid: valid.value });
};
</script>

<template>
  <div class="d-flex justify-center align-center flex-column fill-height">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" width="448" rounded="lg">
      <v-form v-model="valid">
        <div class="text-subtitle-1 text-medium-emphasis">Create Account</div>

        <v-text-field
          v-model="email"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          :rules="emailRules"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Password</div>

        <v-text-field
          v-model="password"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="passwordRules"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="passwordVisible = !passwordVisible"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">Confirm Password</div>

        <v-text-field
          v-model="confirmPassword"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="confirmPasswordRules"
          density="compact"
          placeholder="Confirm your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
        ></v-text-field>

        <v-btn
          class="my-5"
          color="blue"
          size="large"
          variant="tonal"
          block
          :disabled="!valid"
          @click="register"
        >
          Register
        </v-btn>

        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Already have an account? Log in
            <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped></style>
