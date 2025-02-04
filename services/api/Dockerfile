FROM node:22-slim

WORKDIR /app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./
COPY services/api/package*.json ./services/api/
COPY dbs/main/package*.json ./dbs/main/
COPY specs/apis/package*.json ./specs/apis/

# npm install for best caching, remove unnecessary testing and developer deps
COPY tools ./tools
RUN cd tools && npm install --omit=dev
RUN cd tools && npm run clean-docker-deps -- services/api/package.json
RUN npm install

# Copy source files
COPY dbs/main ./dbs/main

COPY specs/apis/dist ./specs/apis/dist

COPY services/api ./services/api

WORKDIR /app/services/api
CMD ["npm", "start"]