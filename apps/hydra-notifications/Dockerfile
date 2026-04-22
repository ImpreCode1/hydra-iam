FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/entrypoint.sh ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/nest-cli.json ./

RUN chmod +x entrypoint.sh

RUN apk add --no-cache grep

EXPOSE 3000

CMD ["./entrypoint.sh"]