FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS dev

# Generate Prisma client (source is mounted as a volume at runtime)
COPY prisma ./prisma
RUN npx prisma generate

# Source code is NOT copied here — it comes from the bind mount in docker-compose
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS prod

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
