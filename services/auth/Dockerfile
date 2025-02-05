FROM node:22-slim

WORKDIR /app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./
COPY services/auth/package*.json ./services/auth/
COPY dbs/auth/package*.json ./dbs/auth/
COPY lib/node-express/package*.json ./lib/node-express/
COPY specs/apis/package*.json ./specs/apis/

RUN npm install --omit=dev

# Copy source files
COPY dbs/auth/src ./dbs/auth/src
COPY dbs/auth/index.ts ./dbs/auth/index.ts
COPY dbs/auth/drizzle.config.ts ./dbs/auth/drizzle.config.ts
COPY dbs/auth/types ./dbs/auth/types
COPY dbs/auth/migrations ./dbs/auth/migrations
COPY dbs/auth/tsconfig.json ./dbs/auth/tsconfig.json

COPY lib/node-express ./lib/node-express

COPY specs/apis/dist ./specs/apis/dist

COPY services/auth ./services/auth

WORKDIR /app/services/auth
CMD ["npm", "start"]