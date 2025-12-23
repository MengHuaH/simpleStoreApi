import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CacheTestModule } from './modules/cache-test/cache-test.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    CacheModule,
    CacheTestModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
