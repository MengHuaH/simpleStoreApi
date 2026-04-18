# 三主体会话管理系统 (Three-Entity Session Management System)

一个基于 NestJS 的三主体（会员、社区员工、平台员工）会话管理系统，提供完整的身份认证、会话管理和用户状态管理功能。

## 🚀 技术栈

### 后端框架

- **NestJS** - 渐进式 Node.js 框架，提供完整的 TypeScript 支持
- **TypeScript** - 强类型 JavaScript 超集

### 数据库 & ORM

- **MySQL 5.7** - 关系型数据库
- **TypeORM** - TypeScript ORM，支持数据映射和查询构建
- **Redis** - 内存数据存储，用于会话缓存和状态管理

### 认证与安全

- **JWT (JSON Web Tokens)** - 无状态身份认证
- **Passkey 支持** - 现代无密码认证方式
- **MFA (多因素认证)** - 增强安全性
- **bcrypt** - 密码哈希加密

### 开发工具

- **Swagger/OpenAPI** - API 文档自动生成
- **Docker & Docker Compose** - 容器化部署
- **NestJS CLI** - 项目脚手架和代码生成

### 架构模式

- **模块化设计** - 清晰的代码组织结构
- **CQRS 模式** - 命令查询职责分离
- **依赖注入** - 松耦合的组件设计
- **Repository 模式** - 数据访问层抽象

## 📋 功能特性

### 用户管理

- 三主体用户类型：会员、社区员工、平台员工
- 用户注册、登录、注销
- 账户启用/禁用管理
- 用户信息查询和搜索

### 会话管理

- JWT 令牌生成和验证
- 会话状态实时监控
- 在线用户统计
- 强制登出功能
- 会话过期管理

### 认证安全

- 密码和 Passkey 双重认证方式
- MFA 多因素认证支持
- 会话安全控制
- 管理员权限管理

### API 功能

- RESTful API 设计
- 完整的 CRUD 操作
- 分页和过滤查询
- 实时状态更新

## 🏗️ 项目结构

```
src/
├── entities/                 # 数据库实体
├── modules/                  # 业务模块
│   ├── members/             # 会员管理
│   ├── community-staffs/    # 社区员工管理
│   ├── platform-staffs/     # 平台员工管理
│   └── sessions/            # 会话管理
├── auth/                    # 认证模块
├── config/                  # 配置文件
├── shared/                  # 共享模块
└── main.ts                  # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js 22+
- MySQL 5.7+
- Redis 6+
- Docker & Docker Compose

### 本地开发

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件配置数据库和 Redis
```

3. 启动开发服务器

```bash
npm run start:dev
```

### Docker 部署

1. 一键部署

```bash
docker-compose up -d
```

2. 查看服务状态

```bash
docker-compose ps
```

3. 查看日志

```bash
docker-compose logs app
```

## 📡 API 文档

应用启动后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:3000/swagger
- JSON 文档: http://localhost:3000/json

## 🔧 配置说明

### 数据库配置

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=app_password
DB_DATABASE=simple_store
```

### Redis 配置

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### JWT 配置

```env
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=3600
```

## 📊 数据库设计

### 核心表结构

- `members` - 会员信息表
- `community_staffs` - 社区员工表
- `platform_staffs` - 平台员工表
- `user_credentials` - 用户凭证表
- `user_sessions` - 用户会话表

### 关系说明

- 一对多关系：用户 ↔ 凭证
- 一对多关系：用户 ↔ 会话
- 多态关系：凭证和会话支持三主体类型

## 🔒 安全特性

### 认证机制

- JWT 令牌认证
- 会话状态实时验证
- Token 自动刷新机制

### 权限控制

- 基于角色的访问控制
- 接口级别权限验证
- 管理员特殊权限

### 数据保护

- 密码加密存储
- 敏感信息脱敏
- SQL 注入防护
