FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
COPY ./tsconfig.json .
COPY ./auth-db/package*.json ./auth-db/
COPY ./auth-app/package*.json ./auth-app/
COPY ./api-spec/package*.json ./api-spec/

RUN npm install

COPY ./auth-db ./auth-db
COPY ./auth-app ./auth-app
COPY ./api-spec ./api-spec

RUN cd api-spec ; npm run generate

WORKDIR /app/auth-app

EXPOSE 3000
