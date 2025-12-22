import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchUsersDto {
  @ApiProperty({ description: '搜索用户名', example: 'john', required: false })
  @IsOptional()
  @IsString({ message: '搜索用户名必须是字符串' })
  userName?: string;

  @ApiProperty({
    description: '搜索邮箱',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '搜索邮箱必须是字符串' })
  email?: string;

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
