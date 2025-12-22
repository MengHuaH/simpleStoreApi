import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;

  @ApiProperty({ description: '名字', example: 'John', required: false })
  @IsOptional()
  @IsString({ message: '名字必须是字符串' })
  firstName?: string;

  @ApiProperty({ description: '姓氏', example: 'Doe', required: false })
  @IsOptional()
  @IsString({ message: '姓氏必须是字符串' })
  lastName?: string;
}
