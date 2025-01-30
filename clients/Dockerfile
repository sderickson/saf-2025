FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
RUN npm install

COPY ./specs/apis/dist ./specs/apis/dist

# Vue app setup
WORKDIR /app/clients
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173