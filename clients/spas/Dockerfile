# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

# install saflib
WORKDIR /app

COPY --parents ./package.json ./package-lock.json ./package.json ./clients/docs/package.json ./clients/spas/package.json ./dbs/main/package.json ./deploy/instance/package.json ./saflib/auth-db/package.json ./saflib/auth-service/package.json ./saflib/auth-spec/package.json ./saflib/auth-vue/package.json ./saflib/dev-tools/package.json ./saflib/drizzle-sqlite3/package.json ./saflib/drizzle-sqlite3-dev/package.json ./saflib/monorepo/package.json ./saflib/monorepo-dev/package.json ./saflib/node-express/package.json ./saflib/node-express-dev/package.json ./saflib/openapi-specs/package.json ./saflib/processes/package.json ./saflib/vitest/package.json ./saflib/vue-spa/package.json ./saflib/vue-spa-dev/package.json ./services/api/package.json ./specs/apis/package.json ./
RUN npm install --omit=dev

# Without these two lines, builds fail with "Cannot find module @rollup/rollup-<platform>. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory."
# I need both for developing locally (on a mac, linux-arm64-gnu) and for deploying to ubuntu (linux-x64-gnu).
# Without the first, `npm run dev -- --build` fails.
# Without the second, `npm run build-and-push` fails.
# But also, one of them will fail depending on the platform, so they have "|| true" to suppress error codes.
RUN npm install @rollup/rollup-linux-arm64-gnu || true
RUN npm install @rollup/rollup-linux-x64-gnu || true

COPY --parents ./ ./clients/docs ./clients/spas ./dbs/main ./deploy/instance ./saflib/auth-db ./saflib/auth-service ./saflib/auth-spec ./saflib/auth-vue ./saflib/dev-tools ./saflib/drizzle-sqlite3 ./saflib/drizzle-sqlite3-dev ./saflib/monorepo ./saflib/monorepo-dev ./saflib/node-express ./saflib/node-express-dev ./saflib/openapi-specs ./saflib/processes ./saflib/vitest ./saflib/vue-spa ./saflib/vue-spa-dev ./services/api ./specs/apis ./

# # Vue app setup
WORKDIR /app/clients/spas