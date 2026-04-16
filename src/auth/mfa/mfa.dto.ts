import { ApiProperty } from '@nestjs/swagger';

export class MfaStatus {
  @ApiProperty({ example: false, description: '是否启用MFA' })
  enabled: boolean;
  @ApiProperty({ example: 'otp', description: 'MFA类型' })
  mfaType: 'otp' | 'totp';
  @ApiProperty({ example: false, description: '是否强制要求MFA' })
  forceMfa: boolean;
  @ApiProperty({ example: '', description: 'MFA状态描述' })
  description: string;
}
