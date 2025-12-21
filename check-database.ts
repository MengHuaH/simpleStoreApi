import { AppDataSource } from './src/data-source';

async function checkDatabase() {
  try {
    console.log('正在连接数据库...');
    await AppDataSource.initialize();
    console.log('数据库连接成功！');

    // 检查表是否存在
    const tables = await AppDataSource.query(`SHOW TABLES LIKE 'users'`);
    if (tables.length > 0) {
      console.log('✅ users 表已存在');

      // 显示表结构
      const columns = await AppDataSource.query(`DESCRIBE users`);
      console.log('\nusers 表结构:');
      console.table(columns);
    } else {
      console.log('❌ users 表不存在');
    }

    await AppDataSource.destroy();
    console.log('\n数据库检查完成！');
  } catch (error) {
    console.error('数据库检查失败:', error);
  }
}

checkDatabase();
