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
import { Public } from './AllowAnon.decorator';
import { ApiResponse as ApiResponseInterface } from '@/common/interface/response.interface';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authMemberService: AuthMemberService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: '会员登录',
    description: '会员登录，需提供会员名、密码',
  })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '会员不存在' })
  async login(
    @Body() loginDto: AuthMemberDto,
  ): Promise<ApiResponseInterface<{ access_token: string }>> {
    return await this.authMemberService.execute(
      loginDto.phone,
      loginDto.password,
    );
  }

  @Public()
  @Post('logout')
  @ApiOperation({
    summary: '会员登出',
    description: '会员登出，需提供token',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: 'token无效' })
  async logout(@Req() req: Request) {
    return await this.authMemberService.logout(req);
  }
}
