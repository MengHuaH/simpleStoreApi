import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cacheConfig from '../config/cache.config';
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule.forFeature(cacheConfig)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
