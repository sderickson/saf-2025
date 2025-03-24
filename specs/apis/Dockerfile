FROM node:22-slim

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./lib/ ./lib/
COPY ./specs/apis ./specs/apis
RUN npm install

WORKDIR /app/specs/apis
RUN npm run generate