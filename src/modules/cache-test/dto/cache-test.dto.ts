import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CacheSetDto {
  @ApiProperty({ description: '缓存键' })
  @IsString()
  key: string;

  @ApiProperty({ description: '缓存值' })
  @IsString()
  value: string;

  @ApiProperty({ description: '缓存过期时间（秒）', required: false })
  @IsOptional()
  @IsNumber()
  ttl?: number;
}

export class CacheGetDto {
  @IsString()
  key: string;
}

export class CacheDeleteDto {
  @IsString()
  key: string;
}

export class CacheExistsDto {
  @IsString()
  key: string;
}

export class CacheIncrementDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  by?: number;
}

export class CacheFlushDto {
  @IsOptional()
  @IsString()
  pattern?: string;
}
