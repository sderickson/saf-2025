FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
COPY ./api-spec/package*.json ./api-spec/

RUN npm install

COPY ./api-spec ./api-spec
RUN cd api-spec ; npm run generate

# Vue app setup
WORKDIR /app/vue-app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173