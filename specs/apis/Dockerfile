# syntax=docker/dockerfile:labs
FROM node:alpine

# install saflib
WORKDIR /app
COPY --parents ./package.json ./package-lock.json ./specs/apis/package.json ./
RUN npm install
COPY --parents ./specs/apis ./

WORKDIR /app/specs/apis
RUN npm run generate