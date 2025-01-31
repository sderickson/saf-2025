FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY services/auth/package*.json ./services/auth/

COPY dbs/auth ./dbs/auth
COPY specs/apis/dist ./specs/apis/dist
COPY services/auth ./services/auth

RUN npm install
WORKDIR /app/services/auth
CMD ["npm", "start"]
