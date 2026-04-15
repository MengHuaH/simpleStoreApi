import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  /**
   * 模拟发送OTP短信
   */
  async sendOtpSms(phone: string, code: string): Promise<void> {
    // 模拟发送短信的延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.log(`📱 模拟发送短信到 ${phone}: 您的验证码是 ${code}，10分钟内有效`);
    
    // 在实际环境中，这里会调用真实的短信服务提供商API
    // 例如：阿里云短信、腾讯云短信等
    
    // 示例：阿里云短信调用
    // await this.aliyunSmsService.sendSms({
    //   PhoneNumbers: phone,
    //   SignName: '您的签名',
    //   TemplateCode: 'SMS_123456789',
    //   TemplateParam: JSON.stringify({ code })
    // });
  }

  /**
   * 模拟发送登录通知短信
   */
  async sendLoginNotification(phone: string, deviceInfo: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.log(`📱 模拟发送登录通知到 ${phone}: 您的账号在 ${deviceInfo} 设备上成功登录`);
  }

  /**
   * 模拟发送安全提醒短信
   */
  async sendSecurityAlert(phone: string, alertType: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.log(`📱 模拟发送安全提醒到 ${phone}: ${alertType}`);
  }

  /**
   * 获取短信发送状态（模拟）
   */
  async getSmsStatus(messageId: string): Promise<{
    status: 'success' | 'failed' | 'sending';
    message: string;
  }> {
    // 模拟查询短信发送状态
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      status: 'success',
      message: '短信发送成功'
    };
  }
}