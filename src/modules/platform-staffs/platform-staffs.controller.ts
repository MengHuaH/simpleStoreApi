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

import { RequiresPlatformStaff } from '../../auth/AllowAnon.decorator';

// Commands Services
import { CreatePlatformStaffService } from './commands/create-platform-staff/create-platform-staff.service';
import { UpdatePlatformStaffService } from './commands/update-platform-staff/update-platform-staff.service';
import { DeletePlatformStaffService } from './commands/delete-platform-staff/delete-platform-staff.service';
import { BindPasskeyPlatformStaffService } from './commands/bindpasskey-platform-staff/bindpasskey-platform-staff.service';
import { EnablePlatformStaffService } from './commands/enable-platform-staff/enable-platform-staff.service';

// Queries Services
import { GetPlatformStaffService } from './queries/get-platform-staff/get-platform-staff.service';
import { ListPlatformStaffsService } from './queries/list-platform-staffs/list-platform-staffs.service';
import { SearchPlatformStaffsService } from './queries/search-platform-staffs/search-platform-staffs.service';

// DTOs
import { CreatePlatformStaffDto } from './commands/create-platform-staff/create-platform-staff.dto';
import { UpdatePlatformStaffDto } from './commands/update-platform-staff/update-platform-staff.dto';
import { ListPlatformStaffsDto } from './queries/list-platform-staffs/list-platform-staffs.dto';
import { SearchPlatformStaffsDto } from './queries/search-platform-staffs/search-platform-staffs.dto';
import { BindPasskeyPlatformStaffDto } from './commands/bindpasskey-platform-staff/bindpasskey-platform-staff.dto';

// Entities
import { PlatformStaff } from '../../entities/platformStaff.entity';
import {
  ApiCustomizeResponse,
  ApiCreatedSuccessResponse,
  ApiCustomizeSuccessResponse,
} from '@/common/decorators/api-response.decorator';

@ApiBearerAuth()
@ApiTags('platform-staffs')
@Controller('platform-staffs')
export class PlatformStaffsController {
  constructor(
    // Commands
    private readonly createPlatformStaffService: CreatePlatformStaffService,
    private readonly updatePlatformStaffService: UpdatePlatformStaffService,
    private readonly deletePlatformStaffService: DeletePlatformStaffService,
    private readonly bindPasskeyPlatformStaffService: BindPasskeyPlatformStaffService,
    private readonly enablePlatformStaffService: EnablePlatformStaffService,
    // Queries
    private readonly getPlatformStaffService: GetPlatformStaffService,
    private readonly listPlatformStaffsService: ListPlatformStaffsService,
    private readonly searchPlatformStaffsService: SearchPlatformStaffsService,
  ) {}

  @RequiresPlatformStaff()
  @Post()
  @ApiCreatedSuccessResponse({
    model: PlatformStaff,
    description: '平台员工创建成功',
  })
  @ApiCustomizeResponse({
    model: PlatformStaff,
    code: 200,
    description: '平台员工创建成功',
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async create(
    @Body() createPlatformStaffDto: CreatePlatformStaffDto,
  ): Promise<PlatformStaff> {
    return this.createPlatformStaffService.execute(createPlatformStaffDto);
  }

  @RequiresPlatformStaff()
  @Get()
  @ApiOperation({ summary: '获取平台员工列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '获取平台员工列表成功' })
  async findAll(
    @Query(new ValidationPipe()) listPlatformStaffsDto: ListPlatformStaffsDto,
  ) {
    return this.listPlatformStaffsService.execute(listPlatformStaffsDto);
  }

  @RequiresPlatformStaff()
  @Post('search')
  @ApiOperation({ summary: '搜索平台员工' })
  @ApiCustomizeSuccessResponse({
    description: '获取成功',
    type: 'object',
  })
  async search(
    @Body(new ValidationPipe())
    searchPlatformStaffsDto: SearchPlatformStaffsDto,
  ) {
    return this.searchPlatformStaffsService.execute(searchPlatformStaffsDto);
  }

  @RequiresPlatformStaff()
  @Get(':id')
  @ApiOperation({ summary: '获取平台员工详情' })
  @ApiResponse({
    status: 200,
    description: '平台员工获取详情成功',
    type: PlatformStaff,
  })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlatformStaff> {
    return this.getPlatformStaffService.execute({ id });
  }

  @RequiresPlatformStaff()
  @Patch(':id')
  @ApiOperation({ summary: '更新平台员工信息' })
  @ApiResponse({
    status: 200,
    description: '平台员工更新成功',
    type: PlatformStaff,
  })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePlatformStaffDto: UpdatePlatformStaffDto,
  ) {
    return await this.updatePlatformStaffService.execute(
      id,
      updatePlatformStaffDto,
    );
  }

  @RequiresPlatformStaff()
  @Post(':id/bind-passkey')
  @ApiOperation({ summary: '绑定平台员工密钥' })
  @ApiCreatedSuccessResponse({
    model: PlatformStaff,
    description: '平台员工密钥绑定成功',
  })
  @ApiCustomizeResponse({
    model: PlatformStaff,
    code: 200,
    description: '平台员工密钥绑定成功',
  })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  @ApiResponse({ status: 409, description: '密钥已被绑定' })
  async bindPasskey(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe())
    bindPasskeyPlatformStaffDto: BindPasskeyPlatformStaffDto,
  ) {
    const platformStaff = await this.bindPasskeyPlatformStaffService.execute(
      id,
      bindPasskeyPlatformStaffDto,
    );
    return platformStaff;
  }

  @RequiresPlatformStaff()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除平台员工' })
  @ApiResponse({ status: 200, description: '平台员工删除成功' })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deletePlatformStaffService.execute(id);
    return { success: true, message: '平台员工删除成功' };
  }

  @RequiresPlatformStaff()
  @Post(':id/enable')
  @ApiOperation({ summary: '启用平台员工' })
  @ApiCreatedSuccessResponse({
    model: PlatformStaff,
    description: '平台员工启用成功',
  })
  @ApiCustomizeResponse({
    model: PlatformStaff,
    code: 200,
    description: '平台员工启用成功',
  })
  @ApiResponse({ status: 404, description: '平台员工不存在' })
  async enable(@Param('id', ParseUUIDPipe) id: string) {
    const platformStaff = await this.enablePlatformStaffService.execute(id);
    return platformStaff;
  }
}
