FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
RUN npm install

COPY ./api-spec/dist ./api-spec/dist

# Vue app setup
WORKDIR /app/vue-app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173