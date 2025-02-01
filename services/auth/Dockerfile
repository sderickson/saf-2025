FROM node:22-slim

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY services/auth/package*.json ./services/auth/

COPY dbs/auth/src ./dbs/auth/src
COPY dbs/auth/index.ts ./dbs/auth/index.ts
COPY dbs/auth/drizzle.config.ts ./dbs/auth/drizzle.config.ts
COPY dbs/auth/types ./dbs/auth/types
COPY dbs/auth/migrations ./dbs/auth/migrations
COPY dbs/auth/tsconfig.json ./dbs/auth/tsconfig.json
COPY specs/apis/dist ./specs/apis/dist
COPY services/auth ./services/auth

RUN npm install
WORKDIR /app/services/auth
CMD ["npm", "start"]