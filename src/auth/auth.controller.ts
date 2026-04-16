import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  Header,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthMemberService } from './auth-member/auth-member.service';
import { AuthMemberDto } from './auth-member/auth-member.dto';
import { AuthCommunityStaffService } from './auth-community-staff/auth-community-staff.service';
import { AuthCommunityStaffDto } from './auth-community-staff/auth-community-staff.dto';
import { AuthPlatformStaffService } from './auth-platform-staff/auth-platform-staff.service';
import { AuthPlatformStaffDto } from './auth-platform-staff/auth-platform-staff.dto';
import { AuthLogoutService } from './shared/auth-logout.service';
import { Public } from './AllowAnon.decorator';
import { ApiResponse as ApiResponseInterface } from '@/common/interface/response.interface';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authMemberService: AuthMemberService,
    private readonly authCommunityStaffService: AuthCommunityStaffService,
    private readonly authPlatformStaffService: AuthPlatformStaffService,
    private readonly authLogoutService: AuthLogoutService,
  ) {}

  // 会员认证接口
  @Public()
  @Post('member')
  @ApiOperation({
    summary: '会员登录',
    description: '会员登录，需提供手机号、密码',
  })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '会员不存在' })
  async loginMember(
    @Body() loginDto: AuthMemberDto,
    @Req() req: Request,
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    const deviceId = this.generateDeviceId(req);
    return await this.authMemberService.execute(
      loginDto.phone,
      loginDto.password,
      loginDto.otpCode,
      loginDto.passkey,
      deviceId,
    );
  }

  // 社区员工认证接口
  @Public()
  @Post('community-staff')
  @ApiOperation({
    summary: '社区员工登录',
    description: '社区员工登录，需提供手机号、密码',
  })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '社区员工不存在' })
  async loginCommunityStaff(
    @Body() loginDto: AuthCommunityStaffDto,
    @Req() req: Request,
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    const deviceId = this.generateDeviceId(req);
    return await this.authCommunityStaffService.execute(
      loginDto.phone,
      loginDto.password,
      loginDto.otpCode,
      loginDto.passkey,
      deviceId,
    );
  }

  // 平台员工认证接口
  @Public()
  @Post('platform-staff')
  @ApiOperation({
    summary: '平台员工登录',
    description: '平台员工登录，需提供手机号、密码',
  })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  async loginPlatformStaff(
    @Body() loginDto: AuthPlatformStaffDto,
    @Req() req: Request,
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    const deviceId = this.generateDeviceId(req);
    return await this.authPlatformStaffService.execute(
      loginDto.phone,
      loginDto.password,
      loginDto.otpCode,
      loginDto.passkey,
      deviceId,
    );
  }

  // 统一的登出接口
  @Public()
  @Post('logout')
  @ApiOperation({
    summary: '统一登出',
    description: '统一登出接口，适用于所有用户类型，需提供token',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: 'token无效' })
  async logout(@Req() req: Request) {
    return await this.authLogoutService.unifiedLogout(req);
  }

  /**
   * 生成设备ID
   */
  private generateDeviceId(req: Request): string {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = this.getClientIp(req);
    
    // 简化的设备指纹生成
    const fingerprint = Buffer.from(`${userAgent}:${ipAddress}`).toString('base64');
    return fingerprint.substring(0, 32); // 限制长度
  }

  /**
   * 获取客户端IP地址
   */
  private getClientIp(req: Request): string {
    // 从常见HTTP头中获取IP地址
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               'unknown';
    return Array.isArray(ip) ? ip[0] : ip;
  }
}
