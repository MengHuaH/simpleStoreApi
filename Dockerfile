# 使用官方 Node.js 运行时作为基础镜像
FROM node:22-alpine3.22 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 检查构建结果
RUN ls -la dist/

# 生产阶段
FROM node:22-alpine3.22 AS production

# 安装必要的工具
RUN apk add --no-cache tzdata curl

# 设置时区
ENV TZ=Asia/Shanghai

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制 node_modules 和 dist 目录
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# 创建日志目录
RUN mkdir -p /app/logs && chown nestjs:nodejs /app/logs

# 切换到非root用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用（在 dist 目录下运行 main.js）
CMD ["node", "dist/cjs/src/main.js"]