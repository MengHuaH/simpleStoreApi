import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredential } from '@/entities/userCredential.entity';
import { SubjectTypeEnum } from '@/entities/enums';
import {
  getMfaConfig,
  updateMfaConfig,
  resetMfaConfig,
  isMfaConfigModified,
  MfaConfig,
} from '../mfa.config';
import { ApiProperty } from '@nestjs/swagger';
import { MfaStatus } from './mfa.dto';

/**
 * MFA管理服务
 * 负责MFA配置的管理和验证
 */
@Injectable()
export class MfaService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
  ) {}

  /**
   * 获取当前MFA配置
   */
  async getMfaConfig(): Promise<MfaConfig> {
    return getMfaConfig();
  }

  /**
   * 启用MFA
   */
  async enableMfa(
    mfaType: 'otp' | 'totp' = 'otp',
    forceMfa: boolean = false,
  ): Promise<MfaStatus> {
    const newConfig = updateMfaConfig({
      enabled: true,
      mfaType,
      forceMfa,
    });

    const config = new MfaStatus();
    config.enabled = true;
    config.mfaType = mfaType;
    config.forceMfa = forceMfa;
    config.description = 'MFA已启用';

    return config;
  }

  /**
   * 禁用MFA
   */
  async disableMfa(): Promise<MfaConfig> {
    const newConfig = updateMfaConfig({
      enabled: false,
      forceMfa: false,
    });

    return newConfig;
  }

  /**
   * 重置MFA配置为默认值
   */
  async resetMfaConfig(): Promise<MfaConfig> {
    return resetMfaConfig();
  }

  /**
   * 检查配置是否已修改
   */
  async isMfaConfigModified(): Promise<boolean> {
    return isMfaConfigModified();
  }

  /**
   * 检查用户是否需要MFA验证
   */
  async requiresMfa(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<boolean> {
    const mfaConfig = await this.getMfaConfig();
    console.log('MFA配置:', mfaConfig);

    // 如果MFA未启用，不需要验证
    if (!mfaConfig.enabled) {
      return false;
    }

    // 如果强制要求MFA，所有用户都需要验证
    if (mfaConfig.forceMfa) {
      return true;
    }

    // 检查用户是否设置了MFA
    // 这里可以根据业务需求实现更复杂的逻辑
    // 例如：检查用户的安全级别、登录环境等

    return false; // 默认不需要MFA
  }

  /**
   * 验证MFA
   */
  async verifyMfa(
    userId: string,
    subjectType: SubjectTypeEnum,
    mfaCode: string,
  ): Promise<boolean> {
    const mfaConfig = await this.getMfaConfig();

    if (!mfaConfig.enabled) {
      throw new BadRequestException('MFA功能未启用');
    }

    // 根据MFA类型进行验证
    switch (mfaConfig.mfaType) {
      case 'otp':
        // 这里可以调用OTP服务进行验证
        // 暂时返回true模拟验证成功
        return true;

      case 'totp':
        // 这里可以实现TOTP验证逻辑
        // 暂时返回true模拟验证成功
        return true;

      default:
        throw new BadRequestException('不支持的MFA类型');
    }
  }

  /**
   * 获取MFA状态
   */

  async getMfaStatus() {
    const config = await this.getMfaConfig();

    return {
      enabled: config.enabled,
      mfaType: config.mfaType,
      forceMfa: config.forceMfa,
      description: this.getMfaDescription(config),
    };
  }

  /**
   * 获取MFA描述
   */
  private getMfaDescription(config: MfaConfig): string {
    if (!config.enabled) {
      return 'MFA功能已关闭';
    }

    const typeDesc = config.mfaType === 'otp' ? '短信验证码' : '时间型验证码';
    const forceDesc = config.forceMfa ? '强制要求' : '可选';

    return `MFA功能已启用，使用${typeDesc}验证，${forceDesc}验证`;
  }
}
