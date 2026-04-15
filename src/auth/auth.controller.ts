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
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    return await this.authMemberService.execute(
      loginDto.phone,
      loginDto.password,
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
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    return await this.authCommunityStaffService.execute(
      loginDto.phone,
      loginDto.password,
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
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    return await this.authPlatformStaffService.execute(
      loginDto.phone,
      loginDto.password,
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
}
