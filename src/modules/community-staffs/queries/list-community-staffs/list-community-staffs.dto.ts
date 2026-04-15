import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ListCommunityStaffsDto {
  @ApiProperty({ example: 0, description: '页码', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @ApiProperty({ example: 10, description: '每页数量', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}