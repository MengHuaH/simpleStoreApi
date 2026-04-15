import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPlatformStaffDto {
  @ApiProperty({ example: 'uuid', description: '平台员工ID' })
  @IsString()
  id: string;
}