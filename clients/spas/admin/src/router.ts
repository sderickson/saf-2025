import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("./pages/Dashboard.vue"),
    name: "Dashboard",
  },
  // Users route will be added later
];

const router = createRouter({
  history: createWebHistory("/admin"), // Base path for the admin SPA
  routes,
});

export default router;
