FROM node:22-slim

WORKDIR /app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./
COPY services/api/package*.json ./services/api/
COPY dbs/main/package*.json ./dbs/main/
COPY lib/node-express/package*.json ./lib/node-express/
COPY specs/apis/package*.json ./specs/apis/
COPY lib/drizzle-sqlite3/package*.json ./lib/drizzle-sqlite3/

RUN npm install --omit=dev

# Copy source files
COPY dbs/main ./dbs/main

COPY lib/node-express ./lib/node-express

COPY specs/apis/dist ./specs/apis/dist

COPY lib/drizzle-sqlite3 ./lib/drizzle-sqlite3

COPY services/api ./services/api

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]
WORKDIR /app/services/api
CMD ["npm", "start"]