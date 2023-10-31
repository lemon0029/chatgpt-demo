FROM node:alpine as builder
WORKDIR /usr/src
RUN npm --registry https://registry.npm.taobao.org install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm --registry https://registry.npm.taobao.org install
COPY . .
RUN pnpm run build

FROM node:alpine
WORKDIR /usr/src
RUN npm install -g pnpm
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/hack ./
COPY package.json pnpm-lock.yaml ./
RUN pnpm --registry https://registry.npm.taobao.org install
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
EXPOSE $PORT
CMD ["/bin/sh", "docker-entrypoint.sh"]
