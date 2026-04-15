import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetCommunityStaffDto {
  @ApiProperty({ example: 'uuid', description: '社区员工ID' })
  @IsString()
  id: string;
}