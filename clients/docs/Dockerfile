# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

WORKDIR /app
COPY --parents ./package.json ./package-lock.json ./saflib/dev-tools/package.json ./clients/docs/package.json ./
RUN npm install --omit=dev
COPY --parents ./saflib/dev-tools ./clients/docs ./

# Make the documentation accessible to vitepress
COPY ./saflib ./saflib

# # Vue app setup
WORKDIR /app/clients/docs