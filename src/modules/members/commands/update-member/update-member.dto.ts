import {
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty({
    description: '手机号',
    example: '13800000000',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  @Length(11, 11, { message: '手机号长度必须是11位' })
  phone: string;

  @ApiProperty({
    description: '密码',
    example: 'newpassword123',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;

  @ApiProperty({
    description: '旧密码',
    example: 'newpassword123',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString({ message: '旧密码必须是字符串' })
  @MinLength(6, { message: '旧密码长度不能少于6位' })
  oldPassword: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  @Length(6, 6, { message: '验证码长度必须是6位' })
  otp: string;
}
