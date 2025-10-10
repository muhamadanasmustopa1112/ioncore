# Use the official Node.js 22 image with Ubuntu base instead of Alpine
FROM node:22.20-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Install necessary system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies without frozen lockfile to accommodate new dependency
RUN pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add Node.js memory optimization and additional flags for build process
ENV NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"

# Disable ESLint during build to allow template project to build
ENV ESLINT_NO_DEV_ERRORS=true
ENV NEXT_IGNORE_ESLINT_DURING_BUILD=true

# Build the application with additional optimizations
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm for production
RUN corepack enable pnpm

# Create nextjs user with proper home directory
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs --create-home --shell /bin/bash nextjs

# Create necessary directories with proper permissions
RUN mkdir -p /home/nextjs/.cache/node/corepack && \
    chown -R nextjs:nodejs /home/nextjs/.cache

# Copy necessary files for production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies only
RUN pnpm install --prod --no-frozen-lockfile && pnpm store prune

# Copy the public folder
COPY --from=builder /app/public ./public

# Copy the build output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["pnpm", "start"]