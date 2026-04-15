import { IsNotEmpty, IsString } from 'class-validator';
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
}
