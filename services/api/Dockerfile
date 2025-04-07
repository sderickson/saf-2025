# syntax=docker/dockerfile:labs
FROM node:22-slim

# install saflib
WORKDIR /app
COPY tsconfig.json ./

# copy packages
COPY --parents ./package.json ./package-lock.json ./dbs/main/package.json ./saflib/node-express/package.json ./specs/apis/package.json ./saflib/drizzle-sqlite3/package.json ./services/api/package.json ./

RUN npm install --omit=dev

# Copy source files
COPY --parents ./dbs/main ./saflib/node-express ./specs/apis ./saflib/drizzle-sqlite3 ./services/api ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]
WORKDIR /app/services/api
CMD ["npm", "start"]