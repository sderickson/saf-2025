# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

# Copy package.json
WORKDIR /app
COPY ./package*.json .
COPY ./tsconfig.json .
COPY ./specs/apis/package*.json ./specs/apis/
COPY ./clients/package*.json ./clients/

RUN npm install --omit=dev
RUN npm install @rollup/rollup-linux-arm64-gnu

# Copy source files
COPY ./specs/apis/ ./specs/apis/
COPY --exclude=**/*.test.ts --exclude=vitest.config.ts ./clients/ ./clients/

# # Vue app setup
WORKDIR /app/clients