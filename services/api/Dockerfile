# syntax=docker/dockerfile:labs
FROM oven/bun:latest

# install saflib
WORKDIR /app
COPY tsconfig.json ./

# copy packages
COPY --parents ./package.json ./package-lock.json ./dbs/main/package.json ./saflib/node-express/package.json ./specs/apis/package.json ./saflib/drizzle-sqlite3/package.json ./services/api/package.json ./
COPY --parents ./saflib/node-express-dev/package.json ./saflib/drizzle-sqlite3-dev/package.json ./saflib/vitest/package.json ./saflib/openapi-specs/package.json ./
COPY ./bun.lockb ./bun.lockb

RUN bun install --filter ./services/api --production

# Copy source files
COPY --parents ./dbs/main ./saflib/node-express ./specs/apis ./saflib/drizzle-sqlite3 ./services/api ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["bun", "run", "healthcheck"]
WORKDIR /app/services/api
CMD ["bun", "run", "start"]