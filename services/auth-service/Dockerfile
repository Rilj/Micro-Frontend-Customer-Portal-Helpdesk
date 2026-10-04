FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service

RUN pnpm install --no-frozen-lockfile
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/services/auth-service/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]
