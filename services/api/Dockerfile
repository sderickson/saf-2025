FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY services/api/package*.json ./services/api/

COPY dbs/main ./dbs/main
COPY specs/apis/dist ./specs/apis/dist
COPY services/api ./services/api

RUN npm install
WORKDIR /app/services/api
CMD ["npm", "start"]
