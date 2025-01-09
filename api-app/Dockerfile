FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
COPY ./db/package*.json ./db/
COPY ./api-app/package*.json ./api-app/

RUN npm install

COPY ./db ./db
COPY ./api-app ./api-app

WORKDIR /app/api-app

EXPOSE 3000