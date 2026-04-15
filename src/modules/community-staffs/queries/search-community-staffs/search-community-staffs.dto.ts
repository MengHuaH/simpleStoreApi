import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchCommunityStaffsDto {
  @ApiProperty({ example: '138', description: '搜索关键词（手机号）' })
  @IsString()
  keyword: string;
}