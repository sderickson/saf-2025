# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

WORKDIR /app
COPY --parents ./package.json ./package-lock.json ./saflib/cron/cron-spec/package.json ./saflib/dev-tools/package.json ./saflib/email/email-vue/package.json ./saflib/env/package.json ./saflib/links/package.json ./saflib/monorepo/package.json ./saflib/openapi/package.json ./saflib/sdk/package.json ./saflib/utils/package.json ./saflib/vue/package.json ./clients/saf-docs/package.json ./
RUN npm install --omit=dev
COPY --parents ./saflib/cron/cron-spec ./saflib/dev-tools ./saflib/email/email-vue ./saflib/env ./saflib/links ./saflib/monorepo ./saflib/openapi ./saflib/sdk ./saflib/utils ./saflib/vue ./clients/saf-docs ./

# Make the documentation accessible to vitepress
COPY ./saflib ./saflib

# # Vue app setup
WORKDIR /app/clients/saf-docs