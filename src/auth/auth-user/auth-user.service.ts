import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@/entities/member.entity';
import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { successResponse } from '@/common/utils/response.util';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ApiResponse } from '@/common/interface/response.interface';
import { CredentialTypeEnum } from '../../entities/enums';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async execute(
    phone: string,
    password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    let member = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!member) {
      throw new NotFoundException(`手机号${phone}不存在`);
    }
    console.log(member);
    if (
      !member ||
      member.userCredential.find(
        (item) =>
          item.credentialType === CredentialTypeEnum.Password &&
          item.credential !== password,
      )
    ) {
      throw new BusinessException(
        `手机号或密码错误`,
        401,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: member.id, phone: member.phone };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });
    return successResponse({ access_token: token });
  }

  async logout(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    const cacheKey = `auth:${token}`;
    await this.cacheService.delete(cacheKey);
  }
}
