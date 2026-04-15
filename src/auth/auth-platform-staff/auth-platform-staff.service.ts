import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformStaff } from '@/entities/platformStaff.entity';
import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { successResponse } from '@/common/utils/response.util';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ApiResponse } from '@/common/interface/response.interface';
import { CredentialTypeEnum } from '../../entities/enums';

@Injectable()
export class AuthPlatformStaffService {
  constructor(
    @InjectRepository(PlatformStaff)
    private readonly repository: Repository<PlatformStaff>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async execute(
    phone: string,
    password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    let platformStaff = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!platformStaff) {
      throw new NotFoundException(`平台员工手机号${phone}不存在`);
    }

    if (
      !platformStaff ||
      platformStaff.userCredential.find(
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

    const payload = { 
      sub: platformStaff.id, 
      phone: platformStaff.phone,
      subjectType: 'platform_staff'
    };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:platform_staff:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });
    return successResponse({ access_token: token });
  }

  async logout(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    const cacheKey = `auth:platform_staff:${token}`;
    await this.cacheService.delete(cacheKey);
  }
}