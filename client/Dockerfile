# Build stage
FROM node:18-alpine as builder
WORKDIR /app
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY package*.json ./
RUN npm ci
COPY . .
# Attempt build and create fallback dist directory
RUN npm run build
# Conditional file operations
RUN if [ -d "dist" ]; then \
    mv dist dist-original && \
    cp -r dist-original dist && \
    find dist -type f -exec sed -i 's/\.ts/.js/g' {} +; \
    else \
    mkdir -p dist && \
    echo "<h1>Application Build Failed</h1>" > dist/index.html; \
    fi

# Production stage
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]