FROM node:22-slim

# install saflib
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY saflib/ ./saflib/
RUN npm install --omit=dev

COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./saflib/ ./saflib/
COPY ./specs/apis ./specs/apis
RUN npm install

WORKDIR /app/specs/apis
RUN npm run generate