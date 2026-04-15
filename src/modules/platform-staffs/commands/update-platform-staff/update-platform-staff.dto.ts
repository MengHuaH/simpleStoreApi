import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePlatformStaffDto {
  @ApiProperty({ example: '13800000001', description: '平台员工手机号', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}