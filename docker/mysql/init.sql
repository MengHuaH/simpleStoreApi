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

-- 使用数据库
USE simple_store;