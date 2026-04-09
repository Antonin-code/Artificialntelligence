# syntax=docker/dockerfile:1

# 1. Base image for dependencies
FROM node:20-alpine AS base

# Install libc6-compat if needed (standard practice for alpine)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time for Next.js 
# (You would pass them as build args if needed, but Next.js "standalone" handles UI configs dynamically mostly, or via CI)
RUN npm run build

# 4. Runner stage (Production ready)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Optimize node runtime
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
