FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/chat-service/package.json ./services/chat-service/
COPY services/knowledge-service/package.json ./services/knowledge-service/
COPY services/auth-service/package.json ./services/auth-service/
COPY shared/types/package.json ./shared/types/

COPY services/chat-service ./services/chat-service

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/chat-service
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/services/chat-service/dist ./dist
COPY services/chat-service/package.json ./package.json

EXPOSE 8002

CMD ["node", "dist/server.js"]