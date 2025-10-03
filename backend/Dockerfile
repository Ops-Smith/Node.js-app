# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY backend/package.json .
COPY backend/package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Copy node_modules from builder stage
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodeuser:nodejs backend/ .

# Create data directory with proper permissions
RUN mkdir -p /app/data && \
    chown -R nodeuser:nodejs /app/data

# Switch to non-root user
USER nodeuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

CMD ["npm", "start"]