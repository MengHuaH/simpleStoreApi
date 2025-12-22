import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersController } from './users.controller';

// Commands (增删改操作)
import { CreateUserService } from './commands/create-user/create-user.service';
import { UpdateUserService } from './commands/update-user/update-user.service';
import { DeleteUserService } from './commands/delete-user/delete-user.service';

// Queries (查询操作)
import { GetUserService } from './queries/get-user/get-user.service';
import { ListUsersService } from './queries/list-users/list-users.service';
import { SearchUsersService } from './queries/search-users/search-users.service';

// Shared
import { UserRepository } from './shared/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    // Shared
    UserRepository,

    // Commands
    CreateUserService,
    UpdateUserService,
    DeleteUserService,

    // Queries
    GetUserService,
    ListUsersService,
    SearchUsersService,
  ],
  exports: [
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
    GetUserService,
    ListUsersService,
    SearchUsersService,
  ],
})
export class UsersModule {}
