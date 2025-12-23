import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'simple-store:',
  },
  ttl: {
    default: process.env.CACHE_DEFAULT_TTL
      ? parseInt(process.env.CACHE_DEFAULT_TTL, 10)
      : 3600, // 1小时
    short: process.env.CACHE_SHORT_TTL
      ? parseInt(process.env.CACHE_SHORT_TTL, 10)
      : 300, // 5分钟
    long: process.env.CACHE_LONG_TTL
      ? parseInt(process.env.CACHE_LONG_TTL, 10)
      : 86400, // 24小时
  },
}));
