FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/shell-host/package.json ./apps/shell-host/
COPY apps/remote-auth/package.json ./apps/remote-auth/
COPY apps/remote-ticketing/package.json ./apps/remote-ticketing/
COPY apps/remote-chat/package.json ./apps/remote-chat/
COPY apps/remote-knowledgebase/package.json ./apps/remote-knowledgebase/

COPY apps/remote-auth ./apps/remote-auth

RUN pnpm install --frozen-lockfile

WORKDIR /app
RUN pnpm --filter remote-auth build

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/remote-auth/dist/assets /usr/share/nginx/html/assets

COPY apps/remote-auth/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]