# Offical node image
FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy packages and install deps
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
