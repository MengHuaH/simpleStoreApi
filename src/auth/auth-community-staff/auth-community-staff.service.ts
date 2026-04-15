import {
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityStaff } from '@/entities/communityStaff.entity';
import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { successResponse } from '@/common/utils/response.util';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ApiResponse } from '@/common/interface/response.interface';
import { CredentialTypeEnum, SubjectTypeEnum } from '../../entities/enums';
import { AuthLogoutService } from '../shared/auth-logout.service';
import { OtpService } from '@/otp/otp.service';
import { SessionService } from '@/modules/sessions/shared/session.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthCommunityStaffService {
  constructor(
    @InjectRepository(CommunityStaff)
    private readonly repository: Repository<CommunityStaff>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private configService: ConfigService,
    private authLogoutService: AuthLogoutService,
    private otpService: OtpService,
    private sessionService: SessionService,
  ) {}

  async execute(
    phone: string,
    password: string,
    otpCode?: string,
    deviceId: string = 'unknown',
  ): Promise<ApiResponse<{ access_token: string }>> {
    let communityStaff = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!communityStaff) {
      throw new NotFoundException(`社区员工手机号${phone}不存在`);
    }
    const passwordItem = communityStaff.userCredential.find(
      (item) => item.credentialType === CredentialTypeEnum.Password,
    );
    if (
      passwordItem &&
      !(await bcrypt.compare(password, passwordItem!.credential))
    ) {
      throw new BusinessException(
        `手机号或密码错误`,
        401,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // OTP验证
    if (otpCode) {
      try {
        await this.otpService.verifyOtp({
          phone,
          code: otpCode,
          subjectType: SubjectTypeEnum.CommunityStaff,
          scenario: 'login',
        });
      } catch (error) {
        throw new BadRequestException(`OTP验证失败: ${error.message}`);
      }
    }

    const payload = {
      sub: communityStaff.id,
      phone: communityStaff.phone,
      subjectType: SubjectTypeEnum.CommunityStaff,
    };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:community_staff:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });

    // 创建会话记录到数据库
    await this.sessionService.createSession(
      communityStaff.id,
      SubjectTypeEnum.CommunityStaff,
      token,
      deviceId,
    );

    return successResponse({ access_token: token });
  }
}
