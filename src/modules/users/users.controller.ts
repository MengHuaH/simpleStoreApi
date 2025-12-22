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
import { CreateUserService } from './commands/create-user/create-user.service';
import { UpdateUserService } from './commands/update-user/update-user.service';
import { DeleteUserService } from './commands/delete-user/delete-user.service';

// Queries Services
import { GetUserService } from './queries/get-user/get-user.service';
import { ListUsersService } from './queries/list-users/list-users.service';
import { SearchUsersService } from './queries/search-users/search-users.service';

// DTOs
import { CreateUserDto } from './commands/create-user/create-user.dto';
import { UpdateUserDto } from './commands/update-user/update-user.dto';
import { ListUsersDto } from './queries/list-users/list-users.dto';
import { SearchUsersDto } from './queries/search-users/search-users.dto';

// Entities
import { User } from '../../entities/user.entity';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly getUserService: GetUserService,
    private readonly listUsersService: ListUsersService,
    private readonly searchUsersService: SearchUsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
    description: '创建新用户，需提供用户名、邮箱、密码、firstName、lastName',
  })
  @ApiResponse({ status: 201, description: '用户创建成功', type: User })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱已存在' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserService.execute(createUserDto);
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
  @ApiResponse({ status: 200, description: '用户列表获取成功' })
  async findAll(@Query() listUsersDto: ListUsersDto) {
    return await this.listUsersService.execute(listUsersDto);
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
  async search(@Query() searchUsersDto: SearchUsersDto) {
    return await this.searchUsersService.execute(searchUsersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiResponse({ status: 200, description: '用户获取成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.getUserService.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '用户更新成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '邮箱已存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.updateUserService.execute(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 204, description: '用户删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteUserService.execute(id);
  }
}
