FROM node:22-slim

# install saflib
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY saflib/ ./saflib/
RUN npm install --omit=dev

COPY services/api/package*.json ./services/api/
COPY dbs/main/package*.json ./dbs/main/
COPY specs/apis/package*.json ./specs/apis/

RUN npm install --omit=dev

# Copy source files
COPY dbs/main ./dbs/main
COPY services/api ./services/api
COPY specs/apis/ ./specs/apis/

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]
WORKDIR /app/services/api
CMD ["npm", "start"]