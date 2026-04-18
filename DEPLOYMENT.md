# Simple Store 应用部署指南

## 环境要求

- Docker 20.10+  
- Docker Compose 2.0+
- 至少 2GB 可用内存

## 快速开始

### 1. 一键部署

```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 2. 手动部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 服务架构

| 服务 | 端口 | 描述 |
|------|------|------|
| simple-store-app | 3000 | NestJS 应用服务 |
| simple-store-mysql | 3306 | MySQL 5.7 数据库 |
| simple-store-redis | 6379 | Redis 缓存服务 |

## 配置文件

### 环境变量

- `.env.docker` - Docker 环境配置
- 可根据需要修改数据库密码、JWT密钥等敏感信息

### 数据库初始化

- `docker/mysql/init.sql` - 数据库初始化脚本
- 首次启动时会自动执行

## 管理命令

### 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 进入容器
docker-compose exec app sh
```

### 数据管理

```bash
# 备份数据库
docker-compose exec mysql mysqldump -u app_user -papp_password simple_store > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u app_user -papp_password simple_store < backup.sql

# 查看Redis数据
docker-compose exec redis redis-cli
```

## 健康检查

应用启动后，可以通过以下方式检查服务状态：

```bash
# 检查应用健康状态
curl http://localhost:3000/api/health

# 检查数据库连接
curl http://localhost:3000/api/health/db

# 检查Redis连接
curl http://localhost:3000/api/health/redis
```

## 故障排除

### 常见问题

1. **端口冲突**
   - 检查 3000、3306、6379 端口是否被占用
   - 修改 `docker-compose.yml` 中的端口映射

2. **数据库连接失败**
   - 检查 MySQL 容器是否正常启动
   - 查看数据库日志：`docker-compose logs mysql`

3. **应用启动失败**
   - 检查依赖是否正确安装
   - 查看应用日志：`docker-compose logs app`

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs app

# 实时查看日志
docker-compose logs -f app
```

## 生产环境部署

### 安全配置

1. **修改默认密码**
   - 修改 `docker-compose.yml` 中的数据库密码
   - 修改 `.env.docker` 中的 JWT 密钥

2. **启用 SSL**
   - 配置反向代理（如 Nginx）
   - 启用 HTTPS

3. **数据备份**
   - 定期备份数据库
   - 配置数据卷持久化

### 性能优化

1. **资源限制**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '1.0'
   ```

2. **负载均衡**
   - 使用多个应用实例
   - 配置负载均衡器

## 开发环境

### 本地开发

```bash
# 使用本地开发环境
npm run dev

# 或者使用 Docker 开发环境
docker-compose -f docker-compose.dev.yml up -d
```

### 调试

```bash
# 进入应用容器
docker-compose exec app sh

# 查看环境变量
echo $DB_HOST

# 测试数据库连接
npm run typeorm:test
```

## 技术支持

如有问题，请查看：
- 应用日志：`docker-compose logs app`
- 数据库日志：`docker-compose logs mysql`
- Redis日志：`docker-compose logs redis`