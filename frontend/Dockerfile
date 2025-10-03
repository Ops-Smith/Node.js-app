# ---------- Stage 1: Build dependencies ----------
FROM node:18-slim AS development

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY public ./public
COPY server.js ./

# Create non-root user
RUN groupadd -r tom && useradd -r -g tom tom \
    && chown -R tom:tom /app

USER tom

# ---------- Stage 2: Production runtime ----------
FROM node:18-alpine AS production

# Create same non-root user
RUN addgroup -S tom && adduser -S tom -G tom

WORKDIR /app

# Copy built app and node_modules from development stage
COPY --from=development /app /app

# Fix ownership
RUN chown -R tom:tom /app

USER tom

# Set default port

EXPOSE 3000

CMD ["npm", "run", "start"]