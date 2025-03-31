# syntax=docker/dockerfile:labs
FROM node:22-slim AS builder

# install saflib
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY saflib/ ./saflib/
RUN npm install --omit=dev

# Copy package.json
COPY ./clients/docs/package*.json ./clients/docs/
RUN npm install --omit=dev

# Copy source files
COPY ./clients/docs/ ./clients/docs/

# # Vue app setup
WORKDIR /app/clients/docs