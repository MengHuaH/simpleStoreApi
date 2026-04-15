import {
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformStaff } from '@/entities/platformStaff.entity';
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
export class AuthPlatformStaffService {
  constructor(
    @InjectRepository(PlatformStaff)
    private readonly repository: Repository<PlatformStaff>,
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
    let platformStaff = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!platformStaff) {
      throw new NotFoundException(`平台员工手机号${phone}不存在`);
    }
    const passwordItem = platformStaff.userCredential.find(
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
          subjectType: SubjectTypeEnum.PlatformStaff,
          scenario: 'login',
        });
      } catch (error) {
        throw new BadRequestException(`OTP验证失败: ${error.message}`);
      }
    }

    const payload = {
      sub: platformStaff.id,
      phone: platformStaff.phone,
      subjectType: SubjectTypeEnum.PlatformStaff,
    };
    const token = await this.jwtService.signAsync(payload);
    const cacheKey = `auth:platform_staff:${token}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(cacheKey, payload, {
      ttl,
    });

    // 创建会话记录到数据库
    await this.sessionService.createSession(
      platformStaff.id,
      SubjectTypeEnum.PlatformStaff,
      token,
      deviceId,
    );

    return successResponse({ access_token: token });
  }
}
