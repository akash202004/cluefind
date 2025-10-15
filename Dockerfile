# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (leveraging Docker cache)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --no-audit --no-fund


# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build Next.js application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Remove caches and unnecessary stuff
RUN rm -rf /app/.next/cache /root/.npm /usr/share/man /tmp/* /var/tmp/*

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
