import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { GetSessionsService } from './queries/get-sessions/get-sessions.service';
import { GetSessionStatsService } from './queries/get-session-stats/get-session-stats.service';
import { CheckSessionService } from './queries/check-session/check-session.service';
import { LogoutSessionService } from './commands/logout-session/logout-session.service';
import { GetSessionsDto } from './queries/get-sessions/get-sessions.dto';
import { GetSessionsResult } from './queries/get-sessions/get-sessions.interface';
import { ApiCustomizeSuccessResponse } from '@/common/decorators/api-response.decorator';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly getSessionsService: GetSessionsService,
    private readonly getSessionStatsService: GetSessionStatsService,
    private readonly checkSessionService: CheckSessionService,
    private readonly logoutSessionService: LogoutSessionService,
  ) {}

  @Post('my-sessions')
  @ApiOperation({
    summary: '获取当前用户的活跃会话',
    description: '获取当前用户的所有活跃会话信息',
  })
  @ApiCustomizeSuccessResponse({
    description: '获取成功',
    type: 'object',
  })
  @ApiResponse({ status: 201, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getMySessions(@Body() request: GetSessionsDto, @Req() req: Request) {
    const user = (req as any).user;
    // 从认证信息中获取用户ID和主体类型，同时保留分页参数
    const getSessionsDto: GetSessionsDto = {
      page: request.page,
      limit: request.limit,
    };

    return await this.getSessionsService.execute(
      user.sub,
      user.subjectType,
      getSessionsDto,
    );
  }

  @Get('stats')
  @ApiOperation({
    summary: '获取会话统计信息',
    description: '获取当前用户的会话统计信息',
  })
  @ApiResponse({ status: 401, description: '未授权' })
  async getSessionStats(@Req() request: Request) {
    const user = (request as any).user;
    return await this.getSessionStatsService.execute(
      user.sub,
      user.subjectType,
    );
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
    return await this.checkSessionService.execute(
      sessionId,
      user.sub,
      user.subjectType,
    );
  }
}
