import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { SubjectTypeEnum } from '@/entities/enums';

export class GetSessionsDto {
  @ApiProperty({
    description: '用户ID',
    example: '815fb4aa-56fb-474a-b181-3800bb0b82b5',
  })
  userId: string;

  @ApiProperty({
    description: '主体类型',
    enum: SubjectTypeEnum,
    example: SubjectTypeEnum.Member,
  })
  @IsEnum(SubjectTypeEnum)
  subjectType: SubjectTypeEnum;

  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
