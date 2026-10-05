FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY services/auth-service/package.json ./services/auth-service/
COPY packages ./packages
COPY shared/types/package.json ./shared/types/

COPY services/auth-service ./services/auth-service

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/auth-service
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY services/auth-service/package.json ./services/auth-service/
COPY packages ./packages
COPY shared/types/package.json ./shared/types/

RUN npm install -g pnpm@9 && \
    cd services/auth-service && \
    pnpm install --prod --filter auth-service...

COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist

WORKDIR /app/services/auth-service

EXPOSE 8000

CMD ["node", "dist/main"]