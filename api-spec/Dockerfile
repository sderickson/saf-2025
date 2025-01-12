FROM node:22-slim

WORKDIR /app/api-spec
COPY ./api-spec ./
RUN npm install
RUN npm run generate

EXPOSE 3000