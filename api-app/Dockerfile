# TODO: Validate this Claude-generated file
FROM node:22-slim

# Install SQLite and build dependencies
RUN apt-get update && \
    apt-get install -y sqlite3 python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data && \
    chmod 777 /app/data

EXPOSE 3000