import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCommunityStaffDto {
  @ApiProperty({ example: '13800000000', description: '社区员工手机号' })
  @IsString()
  phone: string;

  @ApiProperty({ example: true, description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
