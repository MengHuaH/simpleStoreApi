import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubjectTypeEnum } from '@/entities/enums';

export class VerifyOtpDto {
  @ApiProperty({
    description: '手机号',
    example: '13800000000',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  phone: string;

  @ApiProperty({
    description: 'OTP验证码',
    example: '123456',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  code: string;

  @ApiProperty({
    description: '主体类型',
    example: SubjectTypeEnum.Member,
  })
  @IsNotEmpty({ message: '主体类型不能为空' })
  @IsEnum(SubjectTypeEnum)
  subjectType: SubjectTypeEnum;

  @ApiProperty({
    description: '使用场景',
    example: 'login',
  })
  @IsNotEmpty({ message: '场景不能为空' })
  @IsString({ message: '场景必须是字符串' })
  scenario: string = 'login';
}
