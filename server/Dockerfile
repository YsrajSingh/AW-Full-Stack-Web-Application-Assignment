FROM node:18-bullseye
WORKDIR /app

# Install dependencies first for better caching
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files and install
COPY package*.json ./
RUN npm ci --omit=dev --no-optional

# Copy application files
COPY . .

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node healthcheck.js

# Use .env file for environment variables
RUN npm install dotenv-cli -g

# Expose port
EXPOSE 5000

# Start the application with .env loaded
CMD ["dotenv", "-e", "/app/.env", "npm", "start"]
