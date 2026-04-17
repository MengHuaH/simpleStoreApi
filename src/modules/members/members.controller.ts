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

import {
  Public,
  RequiresAny,
  RequiresPlatformStaff,
} from '../../auth/AllowAnon.decorator';

// Commands Services
import { CreateMemberService } from './commands/create-member/create-member.service';
import { UpdateMemberService } from './commands/update-member/update-member.service';
import { DeleteMemberService } from './commands/delete-member/delete-member.service';
import { BindPasskeyMemberService } from './commands/bindpasskey-member/bindpasskey-member.service';
import { EnableMemberService } from './commands/enable-member/enable-member.service';

// Queries Services
import { GetMemberService } from './queries/get-member/get-member.service';
import { ListMembersService } from './queries/list-members/list-members.service';
import { SearchMembersService } from './queries/search-members/search-members.service';

// DTOs
import { CreateMemberDto } from './commands/create-member/create-member.dto';
import { UpdateMemberDto } from './commands/update-member/update-member.dto';
import { ListMembersDto } from './queries/list-members/list-members.dto';
import { SearchMembersDto } from './queries/search-members/search-members.dto';
import { BindPasskeyMemberDto } from './commands/bindpasskey-member/bindpasskey-member.dto';
import { ApiPageResponse } from '@/common/interface/response.interface';
import { ApiCustomizeSuccessResponse } from '@/common/decorators/api-response.decorator';

// Entities
import { Member } from '../../entities/member.entity';
import {
  ApiCustomizeResponse,
  ApiCreatedSuccessResponse,
} from '@/common/decorators/api-response.decorator';
import { RequiresStaff } from '../../auth/AllowAnon.decorator';

@ApiBearerAuth()
@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(
    private readonly createMemberService: CreateMemberService,
    private readonly updateMemberService: UpdateMemberService,
    private readonly deleteMemberService: DeleteMemberService,
    private readonly getMemberService: GetMemberService,
    private readonly listMembersService: ListMembersService,
    private readonly searchMembersService: SearchMembersService,
    private readonly bindPasskeyMemberService: BindPasskeyMemberService,
    private readonly enableMemberService: EnableMemberService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: '创建会员',
    description: '创建新会员，需提供手机号、密码',
  })
  @ApiCreatedSuccessResponse({
    model: Member,
    description: '会员创建成功',
  })
  @ApiCustomizeResponse({
    model: Member,
    code: 200,
    description: '会员创建成功',
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return await this.createMemberService.execute(createMemberDto);
  }

  @RequiresStaff()
  @Get()
  @ApiOperation({ summary: '获取会员列表（分页）' })
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
  @ApiCustomizeSuccessResponse({
    description: '获取成功',
    type: 'object',
  })
  @ApiResponse({
    status: 200,
    description: '会员列表获取成功',
  })
  async findAll(@Query() listMembersDto: ListMembersDto) {
    return await this.listMembersService.execute(listMembersDto);
  }

  @RequiresStaff()
  @Post('search')
  @ApiOperation({ summary: '搜索会员' })
  @ApiCustomizeSuccessResponse({
    description: '获取成功',
    type: 'object',
  })
  async search(@Body() searchMembersDto: SearchMembersDto) {
    return await this.searchMembersService.execute(searchMembersDto);
  }

  @RequiresAny()
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取会员' })
  @ApiResponse({ status: 200, description: '会员获取成功', type: Member })
  @ApiResponse({ status: 404, description: '会员不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Member> {
    return await this.getMemberService.execute(id);
  }

  @RequiresStaff()
  @Patch(':id')
  @ApiOperation({ summary: '更新会员信息' })
  @ApiResponse({ status: 200, description: '会员更新成功', type: Member })
  @ApiResponse({ status: 404, description: '会员不存在' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return await this.updateMemberService.execute(id, updateMemberDto);
  }
  @RequiresAny()
  @Post(':id/bindpasskey')
  @ApiOperation({ summary: '绑定会员密钥' })
  @ApiCreatedSuccessResponse({
    model: Member,
    description: '会员密钥绑定成功',
  })
  @ApiCustomizeResponse({
    model: Member,
    code: 200,
    description: '会员密钥绑定成功',
  })
  @ApiResponse({ status: 404, description: '会员不存在' })
  @ApiResponse({ status: 409, description: '密钥已存在' })
  async bindPasskey(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bindPasskeyMemberDto: BindPasskeyMemberDto,
  ): Promise<Member> {
    return await this.bindPasskeyMemberService.execute(
      id,
      bindPasskeyMemberDto,
    );
  }

  @RequiresPlatformStaff()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除会员' })
  @ApiResponse({ status: 204, description: '会员删除成功' })
  @ApiResponse({ status: 404, description: '会员不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteMemberService.execute(id);
  }

  @RequiresPlatformStaff()
  @Post(':id/enable')
  @ApiOperation({ summary: '启用会员' })
  @ApiCreatedSuccessResponse({
    model: Member,
    description: '会员启用成功',
  })
  @ApiCustomizeResponse({
    model: Member,
    code: 200,
    description: '会员启用成功',
  })
  @ApiResponse({ status: 404, description: '会员不存在' })
  async enable(@Param('id', ParseUUIDPipe) id: string) {
    const member = await this.enableMemberService.execute(id);
    return member;
  }
}
