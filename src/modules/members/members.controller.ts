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

// Commands Services
import { CreateMemberService } from './commands/create-member/create-member.service';
import { UpdateMemberService } from './commands/update-member/update-member.service';
import { DeleteMemberService } from './commands/delete-member/delete-member.service';

// Queries Services
import { GetMemberService } from './queries/get-member/get-member.service';
import { ListMembersService } from './queries/list-members/list-members.service';
import { SearchMembersService } from './queries/search-members/search-members.service';

// DTOs
import { CreateMemberDto } from './commands/create-member/create-member.dto';
import { UpdateMemberDto } from './commands/update-member/update-member.dto';
import { ListMembersDto } from './queries/list-members/list-members.dto';
import { SearchMembersDto } from './queries/search-members/search-members.dto';
import { ApiPageResponse } from '@/common/interface/response.interface';

// Entities
import { Member } from '../../entities/member.entity';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';

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
  ) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
    description: '创建新用户，需提供用户名、邮箱、密码、firstName、lastName',
  })
  @ApiResponse({ status: 201, description: '用户创建成功', type: Member })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return await this.createMemberService.execute(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表（分页）' })
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
  @ApiResponse({
    status: 200,
    description: '用户列表获取成功',
    type: Array<Member>,
  })
  async findAll(@Query() listMembersDto: ListMembersDto) {
    return await this.listMembersService.execute(listMembersDto);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索用户' })
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
  @ApiResponse({ status: 200, description: '搜索成功' })
  async search(@Query() searchMembersDto: SearchMembersDto) {
    return await this.searchMembersService.execute(searchMembersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiResponse({ status: 200, description: '用户获取成功', type: Member })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Member> {
    return await this.getMemberService.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '用户更新成功', type: Member })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '手机号已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return await this.updateMemberService.execute(id, updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 204, description: '用户删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteMemberService.execute(id);
  }
}
