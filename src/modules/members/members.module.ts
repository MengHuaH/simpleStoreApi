import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entities/member.entity';
import { MembersController } from './members.controller';

// Commands (增删改操作)
import { CreateMemberService } from './commands/create-member/create-member.service';
import { UpdateMemberService } from './commands/update-member/update-member.service';
import { DeleteMemberService } from './commands/delete-member/delete-member.service';

// Queries (查询操作)
import { GetMemberService } from './queries/get-member/get-member.service';
import { ListMembersService } from './queries/list-members/list-members.service';
import { SearchMembersService } from './queries/search-members/search-members.service';

// Shared
import { MemberRepository } from './shared/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [
    // Shared
    MemberRepository,

    // Commands
    CreateMemberService,
    UpdateMemberService,
    DeleteMemberService,

    // Queries
    GetMemberService,
    ListMembersService,
    SearchMembersService,
  ],
  exports: [
    CreateMemberService,
    UpdateMemberService,
    DeleteMemberService,
    GetMemberService,
    ListMembersService,
    SearchMembersService,
  ],
})
export class MembersModule {}
