import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheService } from '../../cache/cache.service';
import {
  CacheSetDto,
  CacheGetDto,
  CacheDeleteDto,
  CacheExistsDto,
  CacheIncrementDto,
  CacheFlushDto,
} from './dto/cache-test.dto';
import { Public } from '@/auth/AllowAnon.decorator';

@ApiBearerAuth()
@ApiTags('cache-test')
@Controller('cache-test')
export class CacheTestController {
  constructor(private readonly cacheService: CacheService) {}

  @Public()
  @Post('set')
  @ApiOperation({ summary: '设置缓存值' })
  @ApiResponse({ status: 200, description: '缓存设置成功' })
  async set(@Body() cacheSetDto: CacheSetDto) {
    await this.cacheService.set(cacheSetDto.key, cacheSetDto.value, {
      ttl: cacheSetDto.ttl,
    });
    return { success: true, message: '缓存设置成功' };
  }

  @Public()
  @Post('get')
  @ApiOperation({ summary: '获取缓存值' })
  @ApiResponse({ status: 200, description: '获取缓存成功' })
  async get(@Body() cacheGetDto: CacheGetDto) {
    const value = await this.cacheService.get(cacheGetDto.key);
    return { success: true, data: value };
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除缓存' })
  @ApiResponse({ status: 200, description: '缓存删除成功' })
  async delete(@Body() cacheDeleteDto: CacheDeleteDto) {
    await this.cacheService.delete(cacheDeleteDto.key);
    return { success: true, message: '缓存删除成功' };
  }

  @Post('exists')
  @ApiOperation({ summary: '检查缓存是否存在' })
  @ApiResponse({ status: 200, description: '检查完成' })
  async exists(@Body() cacheExistsDto: CacheExistsDto) {
    const exists = await this.cacheService.exists(cacheExistsDto.key);
    return { success: true, exists };
  }

  @Post('increment')
  @ApiOperation({ summary: '递增缓存值' })
  @ApiResponse({ status: 200, description: '递增成功' })
  async increment(@Body() cacheIncrementDto: CacheIncrementDto) {
    const result = await this.cacheService.increment(
      cacheIncrementDto.key,
      cacheIncrementDto.by || 1,
    );
    return { success: true, result };
  }

  @Post('decrement')
  @ApiOperation({ summary: '递减缓存值' })
  @ApiResponse({ status: 200, description: '递减成功' })
  async decrement(@Body() cacheIncrementDto: CacheIncrementDto) {
    const result = await this.cacheService.decrement(
      cacheIncrementDto.key,
      cacheIncrementDto.by || 1,
    );
    return { success: true, result };
  }

  @Get('info')
  @ApiOperation({ summary: '获取缓存信息' })
  @ApiResponse({ status: 200, description: '获取信息成功' })
  async info() {
    const client = this.cacheService.getClient();
    const info = await client.info();
    return { success: true, info };
  }

  @Post('flush')
  @ApiOperation({ summary: '清空缓存' })
  @ApiResponse({ status: 200, description: '缓存清空成功' })
  async flush(@Body() cacheFlushDto: CacheFlushDto) {
    await this.cacheService.flush(cacheFlushDto.pattern);
    return { success: true, message: '缓存清空成功' };
  }

  @Post('test-complex')
  @ApiOperation({ summary: '测试复杂数据类型缓存' })
  @ApiResponse({ status: 200, description: '复杂数据类型测试完成' })
  async testComplexData() {
    const complexData = {
      user: {
        id: 1,
        name: '测试用户',
        email: 'test@example.com',
        roles: ['admin', 'user'],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      settings: {
        theme: 'dark',
        language: 'zh-CN',
        notifications: true,
      },
    };

    const key = 'complex:test:data';
    await this.cacheService.set(key, complexData, { ttl: 300 });

    const retrievedData = await this.cacheService.get(key);
    const exists = await this.cacheService.exists(key);
    const ttl = await this.cacheService.ttl(key);

    return {
      success: true,
      original: complexData,
      retrieved: retrievedData,
      exists,
      ttl,
    };
  }
}
