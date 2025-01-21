<script setup lang="ts">
import { ref } from "vue";
import { emailRules, passwordRules } from "vue-app/auth/rules";
import { client } from "vue-app/client";

async function test() {
  const { data, error } = await client.GET("/users");
  console.log(data, error);
}
test();

const passwordVisible = ref(false);
const email = ref("");
const password = ref("");
const valid = ref(null);

const login = () => {
  console.log("login", email.value, password.value, { valid: valid.value });
};
</script>

<template>
  <div class="d-flex justify-center align-center flex-column fill-height">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" width="448" rounded="lg">
      <v-form v-model="valid">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
          v-model="email"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          :rules="emailRules"
          autofocus
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Password

          <router-link
            class="text-caption text-decoration-none text-blue"
            to="/forgot"
          >
            Forgot login password?
          </router-link>
        </div>

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
        <v-btn
          class="my-5"
          color="blue"
          size="large"
          variant="tonal"
          block
          :disabled="!valid"
          @click="login"
        >
          Log In
        </v-btn>

        <v-card-text class="text-center">
          <router-link class="text-blue text-decoration-none" to="/register">
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
