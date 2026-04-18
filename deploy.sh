#!/bin/bash

# 简单商店应用一键部署脚本

echo "🚀 开始部署 Simple Store 应用..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止并删除现有容器
echo "📦 清理现有容器..."
docker-compose down

# 构建镜像
echo "🔨 构建应用镜像..."
docker-compose build

# 启动服务
echo "🚀 启动所有服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."

# 检查 MySQL
if docker-compose ps | grep -q "simple-store-mysql.*Up"; then
    echo "✅ MySQL 服务运行正常"
else
    echo "❌ MySQL 服务启动失败"
    exit 1
fi

# 检查 Redis
if docker-compose ps | grep -q "simple-store-redis.*Up"; then
    echo "✅ Redis 服务运行正常"
else
    echo "❌ Redis 服务启动失败"
    exit 1
fi

# 检查应用
if docker-compose ps | grep -q "simple-store-app.*Up"; then
    echo "✅ 应用服务运行正常"
else
    echo "❌ 应用服务启动失败"
    exit 1
fi

# 显示服务信息
echo ""
echo "🎉 部署完成！"
echo ""
echo "📊 服务信息："
echo "   - 应用服务: http://localhost:3000"
echo "   - MySQL数据库: localhost:3306"
echo "   - Redis缓存: localhost:6379"
echo ""
echo "🔧 常用命令："
echo "   - 查看日志: docker-compose logs -f"
echo "   - 停止服务: docker-compose down"
echo "   - 重启服务: docker-compose restart"
echo "   - 重新构建: docker-compose up --build -d"
echo ""

# 等待应用完全启动
echo "⏳ 等待应用完全启动..."
sleep 10

# 测试应用健康状态
echo "🔍 测试应用健康状态..."
if curl -f http://localhost:3000/api/health &> /dev/null; then
    echo "✅ 应用健康检查通过"
else
    echo "⚠️  应用健康检查失败，请检查日志"
fi

echo ""
echo "✨ 部署完成！应用已成功启动"
echo ""
echo "💡 提示：首次启动后需要等待数据库初始化完成"
echo "     可以通过查看日志确认数据库连接状态：docker-compose logs app"