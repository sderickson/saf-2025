FROM node:22-slim

# Mono-repo setup
WORKDIR /app
COPY ./package*.json .
COPY ./tsconfig.json .
COPY ./dbs/auth/package*.json ./dbs/auth/
COPY ./services/auth/package*.json ./services/auth/
COPY ./specs/apis/package*.json ./specs/apis/

RUN npm install

COPY ./dbs/auth ./dbs/auth
COPY ./services/auth ./services/auth
COPY ./specs/apis ./specs/apis

RUN cd specs/apis ; npm install ; npm run generate

WORKDIR /app/services/auth

EXPOSE 3000
