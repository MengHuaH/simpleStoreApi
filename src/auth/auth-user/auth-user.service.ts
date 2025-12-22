import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private jwtService: JwtService,
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
