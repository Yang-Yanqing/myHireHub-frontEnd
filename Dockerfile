# ---------- build stage ----------
FROM node:18-alpine AS build
WORKDIR /app

# 传入 Vite 用的 API 基址（构建时生效）
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
# 如果你用 pnpm / yarn，请改为对应的安装命令
RUN npm ci

COPY . .
RUN npm run build

# ---------- run stage ----------
FROM nginx:alpine
# 自定义 nginx 配置（支持 SPA 回退）
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 用 8080 作为容器内部端口（Fly 推荐）
EXPOSE 8080

# 将 Vite 构建产物放到 Nginx 根目录
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
