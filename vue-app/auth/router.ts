import { createWebHistory, createRouter } from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import RegisterPage from "./views/RegisterPage.vue";
import ForgotPasswordPage from "./views/ForgotPasswordPage.vue";
import LogoutPage from "./views/LogoutPage.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/forgot", component: ForgotPasswordPage },
  { path: "/logout", component: LogoutPage },
];

export const router = createRouter({
  history: createWebHistory("/auth"),
  routes,
});
