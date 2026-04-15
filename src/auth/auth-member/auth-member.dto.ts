import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthMemberDto {
  @ApiProperty({ description: '手机号', example: '13800000000' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  phone: string;

  @ApiProperty({ description: '密码', example: '13800000000' })
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
}
