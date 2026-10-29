# ==============================================================================
# AutoUGC Enterprise Multi-Stage Production Dockerfile
# Hardened, unprivileged, minimal footprint Alpine image for Kubernetes & Docker
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Alpine Image with libc6-compat for Prisma & Node.js Native Addons
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ------------------------------------------------------------------------------
# Stage 2: Dependencies Installation & Prisma Client Generation
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install exact dependencies and generate Prisma client
RUN npm ci --ignore-scripts && npx prisma generate

# ------------------------------------------------------------------------------
# Stage 3: Production Builder
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy cached dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# In build stage, bypass DB connection check
ENV SKIP_ENV_VALIDATION=true

# Build Next.js standalone application
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner (Hardened, Non-Root)
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone server bundle with non-root ownership
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set security context: run as unprivileged user
USER nextjs

# Expose internal HTTP service port
EXPOSE 3000

# Enterprise Container Healthcheck Probe (zero external curl/wget dependencies)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health?probe=liveness', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Launch Next.js standalone server
CMD ["node", "server.js"]
