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
COPY dbs/main/src ./dbs/main/src
COPY dbs/main/index.ts ./dbs/main/index.ts
COPY dbs/main/drizzle.config.ts ./dbs/main/drizzle.config.ts
COPY dbs/main/types ./dbs/main/types
COPY dbs/main/migrations ./dbs/main/migrations
COPY dbs/main/tsconfig.json ./dbs/main/tsconfig.json

COPY lib/node-express ./lib/node-express

COPY specs/apis/dist ./specs/apis/dist

COPY lib/drizzle-sqlite3 ./lib/drizzle-sqlite3

COPY services/api ./services/api

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]
WORKDIR /app/services/api
CMD ["npm", "start"]