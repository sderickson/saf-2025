import { createWebHistory, createRouter } from "vue-router";
import HomePage from "./pages/HomePage.vue";

const routes = [{ path: "/", component: HomePage }];

export const router = createRouter({
  history: createWebHistory("/app"),
  routes,
});
