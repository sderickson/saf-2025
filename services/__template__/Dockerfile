FROM node:22-slim

WORKDIR /app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./
COPY services/__template__/package*.json ./services/__template__/
COPY lib/node-express/package*.json ./lib/node-express/
COPY specs/apis/package*.json ./specs/apis/

RUN npm install --omit=dev

# Copy source files
COPY lib/node-express ./lib/node-express

COPY specs/apis/dist ./specs/apis/dist

COPY services/__template__ ./services/__template__

WORKDIR /app/services/__template__
CMD ["npm", "start"]