FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
COPY ./tsconfig.json .
COPY ./db/package*.json ./db/
COPY ./api-app/package*.json ./api-app/
COPY ./api-spec/package*.json ./api-spec/

RUN npm install

COPY ./db ./db
COPY ./api-app ./api-app
COPY ./api-spec ./api-spec

RUN cd api-spec ; npm run generate

WORKDIR /app/api-app

EXPOSE 3000