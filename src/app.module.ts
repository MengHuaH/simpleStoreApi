import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
