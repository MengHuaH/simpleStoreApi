import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CacheService } from '@/cache/cache.service';
import { SubjectTypeEnum } from '@/entities/enums';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SmsService } from './sms.service';

interface OtpSession {
  code: string;
  phone: string;
  subjectType: SubjectTypeEnum;
  scenario: string;
  createdAt: number;
  expiresAt: number;
  attemptCount: number;
  maxAttempts: number;
  isUsed: boolean;
}

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY = 10 * 60; // 10分钟过期
  private readonly OTP_COOLDOWN = 60; // 60秒冷却期
  private readonly MAX_ATTEMPTS = 5; // 最大尝试次数

  constructor(
    private readonly cacheService: CacheService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * 生成OTP验证码
   */
  private generateOtpCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  /**
   * 构建OTP缓存键
   */
  private buildOtpKey(
    phone: string,
    subjectType: SubjectTypeEnum,
    scenario: string,
  ): string {
    return `otp:${subjectType}:${scenario}:${phone}`;
  }

  /**
   * 发送OTP验证码
   */
  async sendOtp(
    dto: SendOtpDto,
  ): Promise<{ success: boolean; code: string; message: string }> {
    const { phone, subjectType, scenario = 'login' } = dto;
    const otpKey = this.buildOtpKey(phone, subjectType, scenario);

    // 检查是否在冷却期内
    const existingSession = await this.cacheService.get<OtpSession>(otpKey);
    if (existingSession) {
      const timeSinceCreation = Date.now() - existingSession.createdAt;
      if (timeSinceCreation < this.OTP_COOLDOWN * 1000) {
        const remainingSeconds = Math.ceil(
          (this.OTP_COOLDOWN * 1000 - timeSinceCreation) / 1000,
        );
        throw new BadRequestException(
          `请等待${remainingSeconds}秒后再发送验证码`,
        );
      }
    }

    // 生成新的OTP
    const code = this.generateOtpCode();
    const now = Date.now();
    const expiresAt = now + this.OTP_EXPIRY * 1000;

    const otpSession: OtpSession = {
      code,
      phone,
      subjectType,
      scenario: scenario || 'login',
      createdAt: now,
      expiresAt,
      attemptCount: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      isUsed: false,
    };

    // 存储到Redis
    await this.cacheService.set(otpKey, otpSession, { ttl: this.OTP_EXPIRY });

    // 发送短信（模拟）
    await this.smsService.sendOtpSms(phone, code);

    return {
      success: true,
      code: otpSession.code,
      message: '验证码发送成功',
    };
  }

  /**
   * 验证OTP验证码
   */
  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const { phone, code, subjectType, scenario } = dto;
    const otpKey = this.buildOtpKey(phone, subjectType, scenario);

    // 从Redis获取OTP会话
    const otpSession = await this.cacheService.get<OtpSession>(otpKey);
    if (!otpSession) {
      throw new NotFoundException('验证码不存在或已过期');
    }

    // 检查是否已使用
    if (otpSession.isUsed) {
      throw new BadRequestException('验证码已被使用');
    }

    // 检查是否过期
    if (Date.now() > otpSession.expiresAt) {
      throw new BadRequestException('验证码已过期');
    }

    // 检查尝试次数
    if (otpSession.attemptCount >= otpSession.maxAttempts) {
      throw new BadRequestException('验证码尝试次数过多，请重新获取');
    }

    // 验证码匹配
    if (otpSession.code !== code) {
      // 增加尝试次数
      otpSession.attemptCount++;
      await this.cacheService.set(otpKey, otpSession, { ttl: this.OTP_EXPIRY });

      const remainingAttempts =
        otpSession.maxAttempts - otpSession.attemptCount;
      throw new BadRequestException(
        `验证码错误，剩余尝试次数：${remainingAttempts}`,
      );
    }

    // 验证成功，标记为已使用
    otpSession.isUsed = true;
    await this.cacheService.set(otpKey, otpSession, { ttl: this.OTP_EXPIRY });

    return {
      success: true,
      message: '验证码验证成功',
    };
  }

  /**
   * 获取OTP状态
   */
  async getOtpStatus(
    phone: string,
    subjectType: SubjectTypeEnum,
    scenario: string = 'login',
  ): Promise<{
    exists: boolean;
    isUsed: boolean;
    attempts: number;
    maxAttempts: number;
    expiresAt: number | null;
  }> {
    const otpKey = this.buildOtpKey(phone, subjectType, scenario);
    const otpSession = await this.cacheService.get<OtpSession>(otpKey);

    if (!otpSession) {
      return {
        exists: false,
        isUsed: false,
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
        expiresAt: null,
      };
    }

    return {
      exists: true,
      isUsed: otpSession.isUsed,
      attempts: otpSession.attemptCount,
      maxAttempts: otpSession.maxAttempts,
      expiresAt: otpSession.expiresAt,
    };
  }
}
