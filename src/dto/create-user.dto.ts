import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'user123' }) // 必选参数
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱', example: 'user@example.com' }) // 必选参数
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' }) // 必选参数
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: ' firstName', example: 'John' }) // 可选参数
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'lastName', example: 'Doe' }) // 可选参数
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: '手机号', example: '13800138000' }) // 可选参数
  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @ApiProperty({ description: '地址', example: '中国 北京' }) // 可选参数
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '角色:user/admin', example: 'user' }) // 可选参数
  @IsOptional()
  @IsString()
  role?: UserRole;
}
