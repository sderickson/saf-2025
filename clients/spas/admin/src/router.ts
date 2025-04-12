import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Root",
    children: [
      {
        path: "",
        component: () => import("./pages/Dashboard.vue"),
        name: "Dashboard",
      },
      {
        path: "users",
        component: () => import("./pages/Users.vue"),
        name: "Users",
      },
    ],
  },
  // // Users route will be added later
  // {
  //   path: "/users",
  //   component: () => import("./pages/Users.vue"),
  //   name: "Users",
  // },
];

const router = createRouter({
  history: createWebHistory("/admin"), // Base path for the admin SPA
  routes,
});

export default router;
