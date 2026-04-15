import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SubjectTypeEnum } from '@/entities/enums';

export class ListAllSessionsDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: '主体类型过滤',
    enum: SubjectTypeEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(SubjectTypeEnum)
  subjectType?: SubjectTypeEnum;

  @ApiProperty({
    description: '是否只显示活跃会话',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  activeOnly?: boolean = true;

  @ApiProperty({
    description: '用户ID过滤',
    example: 'user-id',
    required: false,
  })
  @IsOptional()
  userId?: string;
}