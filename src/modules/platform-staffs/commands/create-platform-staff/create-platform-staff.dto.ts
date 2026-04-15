import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreatePlatformStaffDto {
  @ApiProperty({ example: '13800000000', description: '平台员工手机号' })
  @IsNotEmpty({ message: '平台员工手机号不能为空' })
  @Length(11, 11, { message: '平台员工手机号长度必须为11位' })
  @IsString({ message: '平台员工手机号必须是字符串' })
  phone: string;

  @ApiProperty({ example: '123456', description: '平台员工密码' })
  @IsNotEmpty({ message: '平台员工密码不能为空' })
  @IsString({ message: '平台员工密码必须是字符串' })
  @MinLength(6, { message: '平台员工密码长度不能少于6位' })
  password: string;

  @ApiProperty({ example: true, description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
