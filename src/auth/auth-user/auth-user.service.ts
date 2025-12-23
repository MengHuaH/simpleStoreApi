import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async execute(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    let user = await this.repository.findOne({ where: { username } });

    if (!user || user.password !== password) {
      throw new NotFoundException(`用户名或密码错误`);
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });
    return { access_token: token };
  }

  async logout(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    const cacheKey = `auth:${token}`;
    await this.cacheService.delete(cacheKey);
  }
}
