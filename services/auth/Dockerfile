FROM node:22-slim

WORKDIR /app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./
COPY services/auth/package*.json ./services/auth/
COPY dbs/auth/package*.json ./dbs/auth/
COPY specs/apis/package*.json ./specs/apis/
COPY lib/ ./lib/

RUN npm install --omit=dev

# Copy source files
COPY dbs/auth ./dbs/auth

COPY lib/node-express ./lib/node-express

COPY specs/apis/dist ./specs/apis/dist

COPY lib/drizzle-sqlite3 ./lib/drizzle-sqlite3

COPY services/auth ./services/auth

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]
WORKDIR /app/services/auth
CMD ["npm", "start"]