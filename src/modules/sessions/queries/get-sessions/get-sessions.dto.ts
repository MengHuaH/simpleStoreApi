import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSessionsDto {
  @ApiProperty({
    description: '用户ID',
    example: '',
  })
  @IsOptional()
  @IsNumber()
  userId?: string = '';

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
}
