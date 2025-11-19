# Use Bun as the base image
FROM oven/bun:1.0-alpine AS base

# Set working directory
WORKDIR /app

# Install security updates and essential packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    tini \
    curl

# Create non-root user for security
RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001

# Copy package files
COPY package.json bun.lockb* bunfig.toml ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN bun install --frozen-lockfile
COPY --chown=bunuser:bunuser . .
USER bunuser
EXPOSE 5000
CMD ["dumb-init", "bun", "run", "dev"]

# Production dependencies stage
FROM base AS prod-deps
ENV NODE_ENV=production
RUN bun install --frozen-lockfile --production

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=prod-deps --chown=bunuser:bunuser /app/node_modules ./node_modules

# Copy application code
COPY --chown=bunuser:bunuser . .

# Create uploads directory
RUN mkdir -p uploads && chown -R bunuser:bunuser uploads

# Switch to non-root user
USER bunuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-5000}/health || exit 1

# Expose port
EXPOSE 5000

# Use tini as init system for proper signal handling
ENTRYPOINT ["tini", "--"]
CMD ["bun", "run", "start"]