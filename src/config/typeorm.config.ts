import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { User } from '@/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'elec_db',
  entities: [BaseEntity, User],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  charset: 'utf8mb4',
  timezone: '+08:00',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};
