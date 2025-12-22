import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({ description: '用户ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID('4', { message: '用户ID必须是有效的UUID格式' })
  id: string;
}