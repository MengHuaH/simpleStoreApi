import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPlatformStaffDto {
  @ApiProperty({ description: '手机号', example: '13800000000' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  phone: string;

  @ApiProperty({ description: '密码', example: 'admin123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string;

  @ApiProperty({
    description: 'OTP验证码（可选，如果启用OTP验证则需要提供）',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '验证码必须是字符串' })
  otpCode?: string;

  @ApiProperty({
    description: 'Passkey认证数据（与密码二选一）',
    example: {
      credentialId: 'credential-id',
      authenticatorData: 'auth-data',
      clientDataJSON: 'client-data',
      signature: 'signature',
    },
    required: false,
  })
  @IsOptional()
  passkey?: any;
}
