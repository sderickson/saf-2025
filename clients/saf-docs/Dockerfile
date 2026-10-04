# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

WORKDIR /app
COPY .saf-docker/stage/saf-docs-client/ ./
RUN npm install --omit=dev
COPY --parents ./saflib/analytics/analytics-sdk ./saflib/analytics/analytics-spec ./saflib/commander ./saflib/cron/cron-spec ./saflib/docker ./saflib/docs ./saflib/email/email-spec ./saflib/email/email-vue ./saflib/env ./saflib/links ./saflib/monorepo ./saflib/openapi ./saflib/ory-kratos/ory-kratos-sdk ./saflib/sdk ./saflib/templates ./saflib/utils ./saflib/vendors/posthog-client ./saflib/vitepress ./saflib/vue ./clients/saf-docs ./

# Make the documentation accessible to vitepress
COPY ./saflib ./saflib
RUN (command -v git >/dev/null 2>&1 || (apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*)) \
  && (git -C /app rev-parse HEAD >/dev/null 2>&1 && /app/saflib/docker/bin/saf-git-hashes/index.ts || echo "Skipping saf-git-hashes: no .git in build context (using pre-generated git-hashes.json)")

# # Vue app setup
WORKDIR /app/clients/saf-docs