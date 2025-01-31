FROM node:22-slim

# Install build dependencies
WORKDIR /app
COPY ./package*.json .
COPY ./tsconfig.json .
COPY ./dbs/main/package*.json ./dbs/main/
COPY ./services/api/package*.json ./services/api/
COPY ./specs/apis/package*.json ./specs/apis/

RUN npm install

COPY ./dbs/main ./dbs/main
COPY ./services/api ./services/api
COPY ./specs/apis ./specs/apis

RUN cd specs/apis ; npm install ; npm run generate

WORKDIR /app/services/api

EXPOSE 3002
