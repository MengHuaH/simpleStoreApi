import { Module } from '@nestjs/common';
import { CacheModule } from '../../cache/cache.module';
import { CacheTestController } from './cache-test.controller';

@Module({
  imports: [CacheModule],
  controllers: [CacheTestController],
})
export class CacheTestModule {}
