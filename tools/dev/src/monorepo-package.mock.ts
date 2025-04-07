const DockerfileTemplate = `
FROM node:20-alpine
WORKDIR /app
#{ copy_packages }#
npm install --omit=dev
#{ copy_src }#
`;

export const monorepoPackageMock = {
  // Root package.json
  "/app/package.json": JSON.stringify({
    name: "@foo/foo",
    workspaces: ["clients/*", "dbs", "saflib/*", "services/*", "specs/*"],
  }),

  // Clients
  "/app/clients/.DS_Store": "",
  "/app/clients/web-www/Dockerfile.template": DockerfileTemplate,
  "/app/clients/web-www/package.json": JSON.stringify({
    name: "@foo/www-web-client",
    dependencies: {
      "@saflib/vue-spa": "*",
      "@foo/custom-lib": "*",
    },
  }),
  "/app/clients/web-auth/Dockerfile.template": DockerfileTemplate,
  "/app/clients/web-auth/package.json": JSON.stringify({
    name: "@foo/auth-web-client",
    dependencies: {
      "@saflib/vue-spa": "*",
      "@saflib/auth-vue": "*",
    },
  }),

  // Dbs
  "/app/dbs/package.json": JSON.stringify({
    name: "@foo/main-db",
    dependencies: {
      "third-party-lib": "3.2.1",
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
  "/app/saflib/.github/some-file.txt": "",
  "/app/saflib/auth-spec/package.json": JSON.stringify({
    name: "@saflib/auth-spec",
    dependencies: {
      "@saflib/openapi-specs": "*",
    },
  }),
  "/app/saflib/auth-vue/package.json": JSON.stringify({
    name: "@saflib/auth-vue",
    dependencies: {
      "third-party-lib": "3.2.1",
      "@saflib/vue-spa": "*",
      "@saflib/auth-spec": "*",
    },
  }),
  "/app/saflib/openapi-specs/package.json": JSON.stringify({
    name: "@saflib/openapi-specs",
    dependencies: {
      "third-party-lib2": "6.5.4",
    },
  }),
  "/app/saflib/node-express/package.json": JSON.stringify({
    name: "@saflib/node-express",
  }),
  "/app/saflib/unused-lib/package.json": JSON.stringify({
    name: "@saflib/unused-lib",
  }),
  "/app/saflib/vue-spa/package.json": JSON.stringify({
    name: "@saflib/vue-spa",
  }),

  // Services
  "/app/services/api/Dockerfile.template": DockerfileTemplate,
  "/app/services/api/package.json": JSON.stringify({
    name: "@foo/api-service",
    dependencies: {
      "@foo/api-spec": "*",
      "@saflib/node-express": "*",
      "@foo/main-db": "*",
    },
  }),
  "/app/services/auth/Dockerfile.template": DockerfileTemplate,
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
