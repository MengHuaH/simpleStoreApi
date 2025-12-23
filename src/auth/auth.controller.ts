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
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthUserService } from './auth-user/auth-user.service';
import { AuthUserDto } from './auth-user/auth-user.dto';
import { Public } from './AllowAnon.decorator';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: '用户登录',
    description: '用户登录，需提供用户名、密码',
  })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async login(
    @Body() loginDto: AuthUserDto,
  ): Promise<{ access_token: string }> {
    return await this.authUserService.execute(
      loginDto.username,
      loginDto.password,
    );
  }

  @Public()
  @Post('logout')
  @ApiOperation({
    summary: '用户登出',
    description: '用户登出，需提供token',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: 'token无效' })
  async logout(@Req() req: Request) {
    return await this.authUserService.logout(req);
  }
}
