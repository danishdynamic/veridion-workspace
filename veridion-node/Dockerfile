# ==========================================
# STAGE 1: Build & Prune Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies needed for compiling/types)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Prune devDependencies so we only pack what is necessary for runtime
RUN npm prune --production

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3001


# Copy only the pruned production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
# Copy package configurations
COPY --from=builder /app/package.json ./package.json
# Copy your application code (pointing to your server source)
COPY --from=builder /app/app ./app

# Expose the Express application port
EXPOSE 3001

# Start the application using tsx (which handles running TS directly in ESM safely)
CMD ["node", "node_modules/tsx/dist/cli.mjs", "app/server.ts"]