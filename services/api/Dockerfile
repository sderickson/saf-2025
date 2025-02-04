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
COPY services/api/package*.json ./services/api/

COPY dbs/main ./dbs/main
COPY specs/apis/package*.json ./specs/apis/
COPY specs/apis/dist ./specs/apis/dist
COPY services/api ./services/api

COPY tools ./tools
RUN cd tools && npm install --omit=dev
RUN cd tools && npm run clean-docker-deps -- services/api/package.json
RUN npm install
WORKDIR /app/services/api
CMD ["npm", "start"]