# Use Node.js LTS as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose the service port
EXPOSE 3000

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD npm run healthcheck

# Start the service
CMD [ "npm", "start" ] 