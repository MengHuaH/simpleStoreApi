/**
 * MFA配置
 * 用于控制是否启用多因素认证
 */

export interface MfaConfig {
  /**
   * 是否启用MFA
   * 默认关闭
   */
  enabled: boolean;

  /**
   * MFA类型
   * 支持的类型：otp（短信验证码）、totp（时间型验证码）
   */
  mfaType: 'otp' | 'totp';

  /**
   * 是否强制要求MFA
   * 如果开启，登录时必须进行MFA验证
   */
  forceMfa: boolean;

  /**
   * 排除的路径（不需要MFA验证的接口）
   */
  excludePaths: string[];
}

/**
 * 默认MFA配置
 */
export const defaultMfaConfig: MfaConfig = {
  enabled: true, // 默认关闭MFA
  mfaType: 'otp', // 默认使用短信验证码
  forceMfa: true, // 默认不强制要求MFA
  excludePaths: [
    '/auth/mfa/enable',
    '/auth/mfa/disable',
    '/auth/otp/send', // OTP发送接口
  ],
};

/**
 * 当前MFA配置（内存存储）
 */
let currentMfaConfig: MfaConfig = { ...defaultMfaConfig };

/**
 * 获取MFA配置
 */
export function getMfaConfig(): MfaConfig {
  // 返回当前的内存配置
  return { ...currentMfaConfig };
}

/**
 * 更新MFA配置
 */
export function updateMfaConfig(config: Partial<MfaConfig>): MfaConfig {
  // 更新内存中的配置
  currentMfaConfig = { ...currentMfaConfig, ...config };

  // 这里可以添加持久化逻辑，比如保存到数据库或配置文件
  // saveMfaConfigToStorage(currentMfaConfig);

  return { ...currentMfaConfig };
}

/**
 * 重置MFA配置为默认值
 */
export function resetMfaConfig(): MfaConfig {
  currentMfaConfig = { ...defaultMfaConfig };
  return { ...currentMfaConfig };
}

/**
 * 检查配置是否已修改
 */
export function isMfaConfigModified(): boolean {
  return JSON.stringify(currentMfaConfig) !== JSON.stringify(defaultMfaConfig);
}
