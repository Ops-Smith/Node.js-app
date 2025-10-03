FROM node:18-slim

# Set working directory
WORKDIR /app

COPY server.js ./
COPY package.json ./
COPY health-check.js ./
COPY data ./data

RUN npm install

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

# Start the application
CMD ["npm", "run", "start"]