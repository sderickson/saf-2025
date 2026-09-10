# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

WORKDIR /app
COPY .saf-docker/stage/blog-client/ ./
RUN npm install --omit=dev
COPY --parents ./saflib/analytics/analytics-sdk ./saflib/analytics/analytics-spec ./saflib/commander ./saflib/cron/cron-spec ./saflib/docker ./saflib/docs ./saflib/email/email-spec ./saflib/email/email-vue ./saflib/env ./saflib/links ./saflib/monorepo ./saflib/openapi ./saflib/ory-kratos/ory-kratos-sdk ./saflib/sdk ./saflib/templates ./saflib/utils ./saflib/vitepress ./saflib/vue ./clients/workflow-docs ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/* \
  && ./saflib/docker/bin/saf-git-hashes/index.ts

# # Vue app setup
WORKDIR /app/clients/workflow-docs