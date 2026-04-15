import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMemberDto {
  @ApiProperty({
    description: '会员ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: '会员ID必须是有效的UUID格式' })
  id: string;
}
