-- 初始化数据库脚本
-- 创建应用数据库和用户权限

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS simple_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建应用用户（如果不存在）
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';

-- 授予权限
GRANT ALL PRIVILEGES ON simple_store.* TO 'app_user'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- -- 使用数据库
-- USE simple_store;

-- -- 创建基础表结构
-- -- 创建 members 表
-- CREATE TABLE IF NOT EXISTS members (
--     id VARCHAR(36) PRIMARY KEY,
--     phone VARCHAR(20),
--     isActive BOOLEAN DEFAULT TRUE,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMP NULL
-- );

-- -- 创建 platform_staffs 表
-- CREATE TABLE IF NOT EXISTS platform_staffs (
--     id VARCHAR(36) PRIMARY KEY,
--     username VARCHAR(50) NOT NULL UNIQUE,
--     isActive BOOLEAN DEFAULT TRUE,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMP NULL
-- );

-- -- 创建 community_staffs 表
-- CREATE TABLE IF NOT EXISTS community_staffs (
--     id VARCHAR(36) PRIMARY KEY,
--     username VARCHAR(50) NOT NULL UNIQUE,
--     isActive BOOLEAN DEFAULT TRUE,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMP NULL
-- );

-- -- 创建 user_credentials 表
-- CREATE TABLE IF NOT EXISTS user_credentials (
--     id VARCHAR(36) PRIMARY KEY,
--     subjectId VARCHAR(36) NOT NULL,
--     subjectType ENUM('member', 'platform_staff', 'community_staff') NOT NULL,
--     credentialType ENUM('password', 'passkey') NOT NULL,
--     credentialValue TEXT,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMP NULL,
--     UNIQUE KEY unique_subject_credential (subjectId, subjectType, credentialType)
-- );

-- -- 创建 user_sessions 表
-- CREATE TABLE IF NOT EXISTS user_sessions (
--     id VARCHAR(36) PRIMARY KEY,
--     subjectId VARCHAR(36) NOT NULL,
--     subjectType ENUM('member', 'platform_staff', 'community_staff') NOT NULL,
--     token TEXT NOT NULL,
--     isActive BOOLEAN DEFAULT TRUE,
--     expiresAt TIMESTAMP NOT NULL,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMP NULL
-- );