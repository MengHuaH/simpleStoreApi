import {
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BindPasskeyMemberDto {
  @ApiProperty({
    description: '密钥',
    example: 'newpasskey123',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '密钥不能为空' })
  @IsString({ message: '密钥必须是字符串' })
  @MinLength(6, { message: '密钥长度不能少于6位' })
  passkey: string;
}
