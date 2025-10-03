# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package.json .
COPY frontend/package-lock.json* ./

# Install all dependencies
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
COPY --chown=nodeuser:nodejs frontend/ .

# Switch to non-root user
USER nodeuser

EXPOSE 3000

CMD ["npm", "start"]