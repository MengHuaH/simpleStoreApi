import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCommunityStaffDto {
  @ApiProperty({ example: '13800000001', description: '社区员工手机号', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}