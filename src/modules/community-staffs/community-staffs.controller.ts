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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Public } from '../../auth/AllowAnon.decorator';

// Commands Services
import { CreateCommunityStaffService } from './commands/create-community-staff/create-community-staff.service';
import { UpdateCommunityStaffService } from './commands/update-community-staff/update-community-staff.service';
import { DeleteCommunityStaffService } from './commands/delete-community-staff/delete-community-staff.service';
import { BindPasskeyCommunityStaffService } from './commands/bindpasskey-community-staff/bindpasskey-community-staff.service';
import { EnableCommunityStaffService } from './commands/enable-community-staff/enable-community-staff.service';

// Queries Services
import { GetCommunityStaffService } from './queries/get-community-staff/get-community-staff.service';
import { ListCommunityStaffsService } from './queries/list-community-staffs/list-community-staffs.service';
import { SearchCommunityStaffsService } from './queries/search-community-staffs/search-community-staffs.service';

// DTOs
import { CreateCommunityStaffDto } from './commands/create-community-staff/create-community-staff.dto';
import { UpdateCommunityStaffDto } from './commands/update-community-staff/update-community-staff.dto';
import { ListCommunityStaffsDto } from './queries/list-community-staffs/list-community-staffs.dto';
import { SearchCommunityStaffsDto } from './queries/search-community-staffs/search-community-staffs.dto';
import { BindPasskeyCommunityStaffDto } from './commands/bindpasskey-community-staff/bindpasskey-community-staff.dto';

// Entities
import { CommunityStaff } from '../../entities/communityStaff.entity';
import {
  ApiCreatedSuccessResponse,
  ApiCustomizeResponse,
  ApiCustomizeSuccessResponse,
} from '@/common/decorators/api-response.decorator';
import {
  RequiresStaff,
  RequiresPlatformStaff,
} from '../../auth/AllowAnon.decorator';

@ApiBearerAuth()
@ApiTags('community-staffs')
@Controller('community-staffs')
export class CommunityStaffsController {
  constructor(
    // Commands
    private readonly createCommunityStaffService: CreateCommunityStaffService,
    private readonly updateCommunityStaffService: UpdateCommunityStaffService,
    private readonly deleteCommunityStaffService: DeleteCommunityStaffService,
    private readonly bindPasskeyCommunityStaffService: BindPasskeyCommunityStaffService,
    private readonly enableCommunityStaffService: EnableCommunityStaffService,
    // Queries
    private readonly getCommunityStaffService: GetCommunityStaffService,
    private readonly listCommunityStaffsService: ListCommunityStaffsService,
    private readonly searchCommunityStaffsService: SearchCommunityStaffsService,
  ) {}

  @RequiresPlatformStaff()
  @Post()
  @ApiOperation({ summary: '创建社区员工' })
  @ApiCreatedSuccessResponse({
    model: CommunityStaff,
    description: '社区员工创建成功',
  })
  @ApiCustomizeResponse({
    model: CommunityStaff,
    code: 200,
    description: '社区员工创建成功',
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async create(
    @Body()
    createCommunityStaffDto: CreateCommunityStaffDto,
  ): Promise<CommunityStaff> {
    return this.createCommunityStaffService.execute(createCommunityStaffDto);
  }

  @RequiresPlatformStaff()
  @Get()
  @ApiOperation({ summary: '获取社区员工列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '获取社区员工列表成功' })
  async findAll(
    @Query(new ValidationPipe()) listCommunityStaffsDto: ListCommunityStaffsDto,
  ) {
    return this.listCommunityStaffsService.execute(listCommunityStaffsDto);
  }

  @RequiresPlatformStaff()
  @Post('search')
  @ApiOperation({ summary: '搜索社区员工' })
  @ApiCustomizeSuccessResponse({
    description: '获取成功',
    type: 'object',
  })
  async search(
    @Body(new ValidationPipe())
    searchCommunityStaffsDto: SearchCommunityStaffsDto,
  ) {
    return this.searchCommunityStaffsService.execute(searchCommunityStaffsDto);
  }

  @RequiresStaff()
  @Get(':id')
  @ApiOperation({ summary: '获取社区员工详情' })
  @ApiResponse({
    status: 200,
    description: '获取社区员工详情成功',
    type: CommunityStaff,
  })
  @ApiResponse({
    status: 404,
    description: '获取社区员工详情成功',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CommunityStaff> {
    return this.getCommunityStaffService.execute({ id });
  }

  @RequiresPlatformStaff()
  @Patch(':id')
  @ApiOperation({ summary: '更新社区员工信息' })
  @ApiResponse({
    status: 200,
    description: '社区员工更新成功',
    type: CommunityStaff,
  })
  @ApiResponse({ status: 404, description: '社区员工不存在' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe())
    updateCommunityStaffDto: UpdateCommunityStaffDto,
  ): Promise<CommunityStaff> {
    return await this.updateCommunityStaffService.execute(
      id,
      updateCommunityStaffDto,
    );
  }

  @RequiresStaff()
  @Post(':id/bindpasskey')
  @ApiOperation({ summary: '绑定社区员工密钥' })
  @ApiCreatedSuccessResponse({
    model: CommunityStaff,
    description: '社区员工密钥绑定成功',
  })
  @ApiCustomizeResponse({
    model: CommunityStaff,
    code: 200,
    description: '社区员工密钥绑定成功',
  })
  @ApiResponse({
    status: 404,
    description: '社区员工不存在',
  })
  @ApiResponse({
    status: 409,
    description: '社区员工密钥绑定失败',
  })
  async bindPasskey(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe())
    bindPasskeyCommunityStaffDto: BindPasskeyCommunityStaffDto,
  ) {
    const communityStaff = await this.bindPasskeyCommunityStaffService.execute(
      id,
      bindPasskeyCommunityStaffDto,
    );
    return communityStaff;
  }

  @RequiresPlatformStaff()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除社区员工' })
  @ApiResponse({ status: 204, description: '社区员工删除成功' })
  @ApiResponse({ status: 404, description: '社区员工不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteCommunityStaffService.execute(id);
    return { success: true, message: '社区员工删除成功' };
  }

  @Post(':id/enable')
  @ApiOperation({ summary: '启用社区员工' })
  @ApiCreatedSuccessResponse({
    model: CommunityStaff,
    description: '社区员工启用成功',
  })
  @ApiCustomizeResponse({
    model: CommunityStaff,
    code: 200,
    description: '社区员工启用成功',
  })
  @ApiResponse({ status: 404, description: '社区员工不存在' })
  async enable(@Param('id', ParseUUIDPipe) id: string) {
    const communityStaff = await this.enableCommunityStaffService.execute(id);
    return communityStaff;
  }
}
