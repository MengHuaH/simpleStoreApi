import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import cacheConfig from '../config/cache.config';

export interface CacheOptions {
  ttl?: number;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(
    @Inject(cacheConfig.KEY)
    private config: ConfigType<typeof cacheConfig>,
  ) {}

  async onModuleInit() {
    this.redisClient = new Redis({
      port: this.config.redis.port,
      host: this.config.redis.host,
    });

    this.redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  async set(
    key: string,
    value: any,
    options: CacheOptions = {},
  ): Promise<void> {
    const ttl = options.ttl || this.config.ttl.default;
    const serializedValue = JSON.stringify(value);

    if (ttl > 0) {
      await this.redisClient.setex(key, ttl, serializedValue);
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async flush(pattern?: string): Promise<void> {
    if (pattern) {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } else {
      await this.redisClient.flushdb();
    }
  }

  async increment(key: string, by = 1): Promise<number> {
    return await this.redisClient.incrby(key, by);
  }

  async decrement(key: string, by = 1): Promise<number> {
    return await this.redisClient.decrby(key, by);
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
