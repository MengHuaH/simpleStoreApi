import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchMembersDto {
  @ApiProperty({
    description: '搜索手机号',
    example: '13800000000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '搜索手机号必须是字符串' })
  phone?: string;

  @ApiProperty({
    description: '搜索是否激活',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '搜索是否激活必须是布尔值' })
  isActive?: boolean;

  @ApiProperty({
    description: '搜索是否在线',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '搜索是否在线必须是布尔值' })
  isOnline?: boolean;

  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码必须是数字' })
  @Min(1, { message: '页码不能小于1' })
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '每页数量必须是数字' })
  @IsPositive({ message: '每页数量必须是正数' })
  limit?: number = 10;
}
