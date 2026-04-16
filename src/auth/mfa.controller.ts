import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MfaService } from './mfa/mfa.service';
import { successResponse, errorResponse } from '@/common/utils/response.util';
import { Public, RequiresPlatformStaff } from './AllowAnon.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsBoolean } from 'class-validator';
import { ApiCustomizeSuccessResponse } from '@/common/decorators/api-response.decorator';
import { MfaStatus } from './mfa/mfa.dto';

/**
 * MFA管理DTO
 */
export class EnableMfaDto {
  /**
   * MFA类型
   */
  @ApiProperty({ description: 'MFA类型', example: 'otp' })
  @IsIn(['otp', 'totp'])
  @IsString()
  mfaType?: 'otp' | 'totp';

  /**
   * 是否强制要求MFA
   */
  @ApiProperty({ description: '是否强制要求MFA', example: true })
  @IsBoolean()
  forceMfa?: boolean;
}

/**
 * MFA管理控制器
 * 提供MFA功能的启用、禁用和状态查询接口
 */
@ApiBearerAuth()
@ApiTags('MFA管理')
@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  /**
   * 获取MFA状态
   */
  @Public()
  @Get('status')
  @ApiOperation({
    summary: '获取MFA状态',
    description: '获取当前MFA功能的启用状态和配置',
  })
  @ApiCustomizeSuccessResponse({ description: '获取成功', type: 'object' })
  async getMfaStatus() {
    const status = await this.mfaService.getMfaStatus();
    return status;
  }

  /**
   * 启用MFA
   */
  @RequiresPlatformStaff()
  @Post('enable')
  @ApiOperation({ summary: '启用MFA', description: '启用多因素认证功能' })
  @ApiResponse({ status: 200, description: '启用成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async enableMfa(@Body() dto: EnableMfaDto) {
    const config = await this.mfaService.enableMfa(dto.mfaType, dto.forceMfa);

    return successResponse({
      message: 'MFA功能已启用',
      config,
    });
  }

  /**
   * 禁用MFA
   */
  @RequiresPlatformStaff()
  @Post('disable')
  @ApiOperation({ summary: '禁用MFA', description: '禁用多因素认证功能' })
  @ApiResponse({ status: 200, description: '禁用成功' })
  async disableMfa() {
    const config = await this.mfaService.disableMfa();

    return successResponse({
      message: 'MFA功能已禁用',
      config,
    });
  }

  /**
   * 验证MFA
   * 这个接口主要用于测试MFA验证功能
   */
  @RequiresPlatformStaff()
  @Post('verify')
  @ApiOperation({ summary: '验证MFA', description: '验证MFA代码（测试用）' })
  @ApiResponse({ status: 200, description: '验证成功' })
  @ApiResponse({ status: 400, description: '验证失败' })
  async verifyMfa(
    @Body('userId') userId: string,
    @Body('subjectType') subjectType: string,
    @Body('mfaCode') mfaCode: string,
  ) {
    const isValid = await this.mfaService.verifyMfa(
      userId,
      subjectType as any,
      mfaCode,
    );

    if (isValid) {
      return successResponse({ message: 'MFA验证成功' });
    } else {
      return errorResponse('MFA验证失败', 400);
    }
  }

  /**
   * 重置MFA配置
   */
  @RequiresPlatformStaff()
  @Post('reset')
  @ApiOperation({ summary: '重置MFA配置', description: '重置MFA配置为默认值' })
  @ApiResponse({ status: 200, description: '重置成功' })
  async resetMfa() {
    const config = await this.mfaService.resetMfaConfig();

    return successResponse({
      message: 'MFA配置已重置为默认值',
      config,
    });
  }

  /**
   * 获取MFA配置状态
   */
  @Public()
  @Get('status/detailed')
  @ApiOperation({
    summary: '获取详细MFA状态',
    description: '获取MFA状态和配置信息',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getMfaStatusDetailed() {
    const status = await this.mfaService.getMfaStatus();
    const isModified = await this.mfaService.isMfaConfigModified();
    const config = await this.mfaService.getMfaConfig();

    return successResponse({
      ...status,
      isModified,
      config,
    });
  }
}
