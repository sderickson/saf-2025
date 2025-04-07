export const monorepoPackageMock = {
  // Root package.json
  "/app/package.json": JSON.stringify({
    name: "@foo/foo",
    workspaces: ["clients/*", "dbs/*", "saflib/*", "services/*", "specs/*"],
  }),

  // Clients
  "/app/clients/web-www/package.json": JSON.stringify({
    name: "@foo/www-web-client",
    dependencies: {
      "@saflib/vue-spa": "*",
      "@foo/custom-lib": "*",
    },
  }),
  "/app/clients/web-auth/package.json": JSON.stringify({
    name: "@foo/auth-web-client",
    dependencies: {
      "@saflib/vue-spa": "*",
      "@saflib/auth-vue": "*",
    },
  }),

  // Lib
  "/app/lib/custom-lib/package.json": JSON.stringify({
    name: "@foo/custom-lib",
    dependencies: {
      "third-party-lib": "3.2.1",
    },
  }),

  // Saflib
  "/app/saflib/auth-spec/package.json": JSON.stringify({
    name: "@saflib/auth-spec",
    dependencies: {
      "@saflib/openapi-specs": "*",
    },
  }),
  "/app/saflib/auth-vue/package.json": JSON.stringify({
    name: "@saflib/auth-vue",
    dependencies: {
      "@saflib/vue-spa": "*",
      "third-party-lib": "3.2.1",
      "@saflib/auth-spec": "*",
    },
  }),
  "/app/saflib/openapi-specs/package.json": JSON.stringify({
    name: "@saflib/openapi-specs",
    dependencies: {
      "third-party-lib": "3.2.1",
    },
  }),
  "/app/saflib/node-express/package.json": JSON.stringify({
    name: "@saflib/node-express",
    dependencies: {
      "third-party-lib": "3.2.1",
    },
  }),
  "/app/saflib/vue-spa/package.json": JSON.stringify({
    name: "@saflib/vue-spa",
    dependencies: {
      "third-party-lib": "3.2.1",
    },
  }),

  // Services
  "/app/services/api/package.json": JSON.stringify({
    name: "@foo/api-service",
    dependencies: {
      "@foo/api-spec": "*",
      "@saflib/node-express": "*",
    },
  }),
  "/app/services/auth/package.json": JSON.stringify({
    name: "@foo/auth-service",
    dependencies: {
      "@saflib/auth-spec": "*",
      "@saflib/node-express": "*",
    },
  }),

  // Specs
  "/app/specs/api/package.json": JSON.stringify({
    name: "@foo/api-spec",
    dependencies: {
      "@saflib/openapi-specs": "*",
    },
  }),
};
