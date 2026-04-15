import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityStaff } from '@/entities/communityStaff.entity';
import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { successResponse } from '@/common/utils/response.util';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ApiResponse } from '@/common/interface/response.interface';
import { CredentialTypeEnum } from '../../entities/enums';

@Injectable()
export class AuthCommunityStaffService {
  constructor(
    @InjectRepository(CommunityStaff)
    private readonly repository: Repository<CommunityStaff>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async execute(
    phone: string,
    password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    let communityStaff = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!communityStaff) {
      throw new NotFoundException(`社区员工手机号${phone}不存在`);
    }

    if (
      !communityStaff ||
      communityStaff.userCredential.find(
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
      sub: communityStaff.id, 
      phone: communityStaff.phone,
      subjectType: 'community_staff'
    };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:community_staff:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });
    return successResponse({ access_token: token });
  }

  async logout(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    const cacheKey = `auth:community_staff:${token}`;
    await this.cacheService.delete(cacheKey);
  }
}