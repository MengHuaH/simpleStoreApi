import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { GetSessionsService } from './queries/get-sessions/get-sessions.service';
import { LogoutSessionService } from './commands/logout-session/logout-session.service';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly getSessionsService: GetSessionsService,
    private readonly logoutSessionService: LogoutSessionService,
  ) {}

  @Get('my-sessions')
  @ApiOperation({
    summary: '获取当前用户的活跃会话',
    description: '获取当前用户的所有活跃会话信息',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getMySessions(@Req() request: Request) {
    const user = (request as any).user;
    return await this.getSessionsService.execute(user.sub, user.subjectType);
  }

  @Get('stats')
  @ApiOperation({
    summary: '获取会话统计信息',
    description: '获取当前用户的会话统计信息',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getSessionStats(@Req() request: Request) {
    const user = (request as any).user;
    return await this.getSessionsService.getStats(user.sub, user.subjectType);
  }

  @Delete('logout/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '登出指定会话',
    description: '强制登出指定的会话',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '会话不存在' })
  async logoutSession(
    @Param('sessionId') sessionId: string,
    @Req() request: Request,
  ) {
    const user = (request as any).user;
    return await this.logoutSessionService.execute(
      sessionId,
      user.sub,
      user.subjectType,
    );
  }

  @Delete('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '登出所有会话',
    description: '强制登出当前用户的所有会话',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async logoutAllSessions(@Req() request: Request) {
    const user = (request as any).user;
    return await this.logoutSessionService.logoutAllSessions(
      user.sub,
      user.subjectType,
    );
  }

  @Get('check/:sessionId')
  @ApiOperation({
    summary: '检查会话状态',
    description: '检查指定会话的状态是否有效',
  })
  @ApiResponse({ status: 200, description: '检查完成' })
  async checkSessionStatus(
    @Param('sessionId') sessionId: string,
    @Req() request: Request,
  ) {
    const user = (request as any).user;
    return await this.getSessionsService.checkSession(
      sessionId,
      user.sub,
      user.subjectType,
    );
  }
}
