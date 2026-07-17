# ==========================================
# Stage 1: Dependency Installer
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package management files for optimal layer caching
COPY package.json package-lock.json* ./

# Install dependencies strictly matching the lockfile
RUN npm ci

# ==========================================
# Stage 2: Application Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Un-comment the line below to disable telemetry during the build phase.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# ==========================================
# Stage 3: Minimal Production Runtime
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-privileged system user for execution safety
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up asset caching directories with matching ownership
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Execute the self-contained production server binary entrypoint
CMD ["node", "server.js"]