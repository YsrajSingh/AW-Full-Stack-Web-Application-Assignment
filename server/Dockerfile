FROM node:18-bullseye
WORKDIR /app

# Install dependencies first for better caching
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files and install
COPY package*.json ./
RUN npm ci --omit=dev --no-optional

# Copy application files
COPY . .

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node healthcheck.js

EXPOSE 5000
CMD ["npm", "start"]