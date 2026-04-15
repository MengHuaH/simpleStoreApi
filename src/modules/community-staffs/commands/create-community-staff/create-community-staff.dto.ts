import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateCommunityStaffDto {
  @ApiProperty({ example: '13800000000', description: '社区员工手机号' })
  @IsNotEmpty({ message: '社区员工手机号不能为空' })
  @Length(11, 11, { message: '社区员工手机号长度必须为11位' })
  @IsString({ message: '社区员工手机号必须是字符串' })
  phone: string;

  @ApiProperty({ description: '社区员工密码', example: '13800000000' })
  @IsNotEmpty({ message: '社区员工密码不能为空' })
  @IsString({ message: '社区员工密码必须是字符串' })
  @MinLength(6, { message: '社区员工密码长度不能少于6位' })
  password: string;
}
