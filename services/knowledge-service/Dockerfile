FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/knowledge-service/package.json ./services/knowledge-service/
COPY services/chat-service/package.json ./services/chat-service/
COPY services/auth-service/package.json ./services/auth-service/
COPY shared/types/package.json ./shared/types/

COPY services/knowledge-service ./services/knowledge-service

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/knowledge-service
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/services/knowledge-service/dist ./dist
COPY services/knowledge-service/package.json ./package.json

EXPOSE 8003

CMD ["node", "dist/server.js"]