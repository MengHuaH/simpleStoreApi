import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ListAllSessionsService } from './queries/list-all-sessions/list-all-sessions.service';
import { AdminLogoutSessionService } from './commands/admin-logout-session/admin-logout-session.service';
import { ListAllSessionsDto } from './queries/list-all-sessions/list-all-sessions.dto';
import { RequiresPlatformStaff } from '@/auth/AllowAnon.decorator';
import { ApiCustomizeSuccessResponse } from '@/common/decorators/api-response.decorator';

@ApiBearerAuth()
@ApiTags('admin-sessions')
@Controller('admin/sessions')
@RequiresPlatformStaff()
export class AdminSessionsController {
  constructor(
    private readonly listAllSessionsService: ListAllSessionsService,
    private readonly adminLogoutSessionService: AdminLogoutSessionService,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '管理员分页查询所有会话',
    description: '管理员分页查询所有用户的会话信息，支持过滤条件',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '页码，默认1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '每页数量，默认10',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async listAllSessions(
    @Query()
    queryDto: ListAllSessionsDto,
  ) {
    return await this.listAllSessionsService.execute(queryDto);
  }

  @Get('stats')
  @ApiOperation({
    summary: '管理员获取会话统计信息',
    description: '管理员获取系统所有会话的统计信息',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async getSessionStats() {
    return await this.listAllSessionsService.getStats();
  }

  @Delete('logout/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '管理员踢出指定会话',
    description: '管理员强制踢出指定的会话',
  })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '会话不存在' })
  async adminLogoutSession(@Param('sessionId') sessionId: string) {
    return await this.adminLogoutSessionService.execute(sessionId);
  }

  @Delete('logout-user/:userId/:subjectType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '管理员踢出用户所有会话',
    description: '管理员强制踢出指定用户的所有会话',
  })
  @ApiCustomizeSuccessResponse({ description: '登出成功', type: 'object' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async adminLogoutAllUserSessions(
    @Param('userId') userId: string,
    @Param('subjectType') subjectType: string,
  ) {
    return await this.adminLogoutSessionService.logoutAllUserSessions(
      userId,
      subjectType,
    );
  }

  @Post('logout-by-criteria')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '管理员按条件批量踢出会话',
    description: '管理员根据条件批量踢出符合条件的会话',
  })
  @ApiCustomizeSuccessResponse({ description: '登出成功', type: 'object' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async logoutSessionsByCriteria(
    @Body()
    criteria: {
      subjectType?: string;
      userId?: string;
      activeOnly?: boolean;
    },
  ) {
    return await this.adminLogoutSessionService.logoutSessionsByCriteria(
      criteria,
    );
  }
}
