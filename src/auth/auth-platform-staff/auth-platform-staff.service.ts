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
import { PasskeyService } from '../shared/passkey.service';
import { MfaService } from '../mfa/mfa.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthPlatformStaffService {
  constructor(
    @InjectRepository(PlatformStaff)
    private readonly repository: Repository<PlatformStaff>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly otpService: OtpService,
    private readonly sessionService: SessionService,
    private readonly passkeyService: PasskeyService,
    private readonly mfaService: MfaService,
  ) {}

  async execute(
    phone: string,
    password?: string,
    otpCode?: string,
    passkey?: any,
    deviceId: string = 'unknown',
  ): Promise<PlatformStaff> {
    let platformStaff = await this.repository.findOne({
      where: { phone },
      relations: ['userCredential'],
    });
    if (!platformStaff) {
      throw new NotFoundException(`平台员工手机号${phone}不存在`);
    }
    if (!platformStaff.isActive) {
      throw new BusinessException('平台员工已被禁用', 202, HttpStatus.ACCEPTED);
    }

    let token: string;
    let authenticated = false;

    // 检查是否需要MFA验证（先检查，影响后续逻辑）
    const requiresMfa = await this.mfaService.requiresMfa(
      platformStaff!.id,
      SubjectTypeEnum.PlatformStaff,
    );

    // MFA开启后的特殊逻辑：验证码不能单独使用
    if (requiresMfa) {
      // 必须提供主凭证（密码或Passkey）
      if (!password && !passkey) {
        throw new BadRequestException('MFA开启后必须提供密码或Passkey进行登录');
      }

      // 必须提供验证码作为第二因素
      if (!otpCode) {
        throw new BadRequestException('MFA开启后必须提供验证码进行登录');
      }

      // ✅ 验证验证码的正确性（MFA开启时必须验证）
      try {
        await this.otpService.verifyOtp({
          phone,
          code: otpCode,
          subjectType: SubjectTypeEnum.PlatformStaff,
          scenario: 'login',
        });
      } catch (error) {
        throw new BadRequestException('MFA验证码错误或已过期');
      }
    }

    // 单一验证方式登录：三种方式任意一种通过即可（MFA关闭时）
    // MFA开启时，验证码只能作为第二因素配合主凭证使用

    // 1. Passkey登录（设备自动登录）
    if (passkey) {
      const result = await this.passkeyService.verifyPasskeyLogin(
        phone,
        passkey,
        SubjectTypeEnum.PlatformStaff,
      );
      token = result.token;
      authenticated = true;
    }

    // 2. 密码登录
    else if (password) {
      const passwordItem = platformStaff.userCredential.find(
        (item) => item.credentialType === CredentialTypeEnum.Password,
      );
      if (!passwordItem) {
        throw new BusinessException(
          `用户未设置密码，请使用其他方式登录`,
          401,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!(await bcrypt.compare(password, passwordItem!.credential))) {
        throw new BusinessException(`密码错误`, 401, HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        sub: platformStaff.id,
        phone: platformStaff.phone,
        subjectType: SubjectTypeEnum.PlatformStaff,
      };
      token = await this.jwtService.signAsync(payload);
      authenticated = true;
    }

    // 3. 验证码登录（仅当MFA关闭时可用）
    else if (otpCode && !requiresMfa) {
      try {
        await this.otpService.verifyOtp({
          phone,
          code: otpCode,
          subjectType: SubjectTypeEnum.PlatformStaff,
          scenario: 'login',
        });

        const payload = {
          sub: platformStaff.id,
          phone: platformStaff.phone,
          subjectType: SubjectTypeEnum.PlatformStaff,
        };
        token = await this.jwtService.signAsync(payload);
        authenticated = true;
      } catch (error) {
        throw new BadRequestException(`验证码错误或已过期`);
      }
    }

    // 如果没有提供任何验证方式
    if (!authenticated) {
      if (requiresMfa) {
        throw new BadRequestException('MFA开启后必须提供密码或Passkey进行登录');
      } else {
        throw new BadRequestException('请提供密码、验证码或Passkey进行登录');
      }
    }

    const cacheKey = `auth:platform_staff:${token!}`;
    const ttl = this.configService.get('cache.ttl.long');
    await this.cacheService.set(
      cacheKey,
      {
        sub: platformStaff!.id,
        phone: platformStaff!.phone,
        subjectType: SubjectTypeEnum.PlatformStaff,
      },
      {
        ttl,
      },
    );

    // 创建会话记录到数据库
    const session = await this.sessionService.createSession(
      platformStaff!.id,
      SubjectTypeEnum.PlatformStaff,
      token!,
      deviceId,
    );

    const newPlatformStaff = {
      ...platformStaff,
    };

    newPlatformStaff.userSession = [session];

    return newPlatformStaff;
  }
}
