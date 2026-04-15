import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubjectTypeEnum } from '@/entities/enums';

export class SendOtpDto {
  @ApiProperty({
    description: '手机号',
    example: '13800000000',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  phone: string;

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
    required: false,
  })
  @IsOptional()
  @IsString({ message: '场景必须是字符串' })
  scenario?: string = 'login';
}
