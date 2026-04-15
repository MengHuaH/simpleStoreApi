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

// Queries Services
import { GetPlatformStaffService } from './queries/get-platform-staff/get-platform-staff.service';
import { ListPlatformStaffsService } from './queries/list-platform-staffs/list-platform-staffs.service';
import { SearchPlatformStaffsService } from './queries/search-platform-staffs/search-platform-staffs.service';

// DTOs
import { CreatePlatformStaffDto } from './commands/create-platform-staff/create-platform-staff.dto';
import { UpdatePlatformStaffDto } from './commands/update-platform-staff/update-platform-staff.dto';
import { ListPlatformStaffsDto } from './queries/list-platform-staffs/list-platform-staffs.dto';
import { SearchPlatformStaffsDto } from './queries/search-platform-staffs/search-platform-staffs.dto';

// Entities
import { PlatformStaff } from '../../entities/platformStaff.entity';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';

@ApiBearerAuth()
@ApiTags('platform-staffs')
@Controller('platform-staffs')
export class PlatformStaffsController {
  constructor(
    // Commands
    private readonly createPlatformStaffService: CreatePlatformStaffService,
    private readonly updatePlatformStaffService: UpdatePlatformStaffService,
    private readonly deletePlatformStaffService: DeletePlatformStaffService,
    // Queries
    private readonly getPlatformStaffService: GetPlatformStaffService,
    private readonly listPlatformStaffsService: ListPlatformStaffsService,
    private readonly searchPlatformStaffsService: SearchPlatformStaffsService,
  ) {}

  @RequiresPlatformStaff()
  @Post()
  @ApiOperation({ summary: '创建平台员工' })
  @ApiResponse({ status: 201, description: '平台员工创建成功' })
  @ApiSuccessResponse(PlatformStaff, '平台员工创建成功')
  async create(
    @Body(new ValidationPipe()) createPlatformStaffDto: CreatePlatformStaffDto,
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
  @Get('search')
  @ApiOperation({ summary: '搜索平台员工' })
  @ApiResponse({ status: 200, description: '搜索平台员工成功' })
  async search(
    @Query(new ValidationPipe())
    searchPlatformStaffsDto: SearchPlatformStaffsDto,
  ) {
    return this.searchPlatformStaffsService.execute(searchPlatformStaffsDto);
  }

  @RequiresPlatformStaff()
  @Get(':id')
  @ApiOperation({ summary: '获取平台员工详情' })
  @ApiResponse({ status: 200, description: '获取平台员工详情成功' })
  @ApiSuccessResponse(PlatformStaff, '获取平台员工详情成功')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlatformStaff> {
    return this.getPlatformStaffService.execute({ id });
  }

  @RequiresPlatformStaff()
  @Patch(':id')
  @ApiOperation({ summary: '更新平台员工信息' })
  @ApiResponse({ status: 200, description: '平台员工信息更新成功' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePlatformStaffDto: UpdatePlatformStaffDto,
  ) {
    await this.updatePlatformStaffService.execute(id, updatePlatformStaffDto);
    return { success: true, message: '平台员工信息更新成功' };
  }

  @RequiresPlatformStaff()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除平台员工' })
  @ApiResponse({ status: 200, description: '平台员工删除成功' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deletePlatformStaffService.execute(id);
    return { success: true, message: '平台员工删除成功' };
  }
}
