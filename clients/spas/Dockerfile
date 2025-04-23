# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

# install saflib
WORKDIR /app

COPY --parents ./package.json ./package-lock.json ./clients/spas/package.json ./specs/apis/package.json ./saflib/auth-spec/package.json ./saflib/auth-vue/package.json ./saflib/monorepo/package.json ./saflib/openapi-specs/package.json ./saflib/vue-spa/package.json ./
RUN npm install --omit=dev

# Without these two lines, builds fail with "Cannot find module @rollup/rollup-<platform>. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory."
# I need both for developing locally (on a mac, linux-arm64-gnu) and for deploying to ubuntu (linux-x64-gnu).
# Without the first, `npm run dev -- --build` fails.
# Without the second, `npm run build-and-push` fails.
# But also, one of them will fail depending on the platform, so they have "|| true" to suppress error codes.
RUN npm install @rollup/rollup-linux-arm64-gnu || true
RUN npm install @rollup/rollup-linux-x64-gnu || true

COPY --parents ./clients/spas ./specs/apis ./saflib/auth-spec ./saflib/auth-vue ./saflib/monorepo ./saflib/openapi-specs ./saflib/vue-spa ./

# # Vue app setup
WORKDIR /app/clients/spas