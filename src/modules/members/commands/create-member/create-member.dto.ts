import { IsNotEmpty, IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: '会员手机号', example: '13800000000' })
  @IsNotEmpty({ message: '会员手机号不能为空' })
  @IsString({ message: '会员手机号必须是字符串' })
  @Length(11, 11, { message: '会员手机号长度必须是11位' })
  phone: string;

  @ApiProperty({ description: '会员密码', example: '13800000000' })
  @IsNotEmpty({ message: '会员密码不能为空' })
  @IsString({ message: '会员密码必须是字符串' })
  @MinLength(6, { message: '会员密码长度不能少于6位' })
  password: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  @Length(6, 6, { message: '验证码长度必须是6位' })
  otp: string;
}
