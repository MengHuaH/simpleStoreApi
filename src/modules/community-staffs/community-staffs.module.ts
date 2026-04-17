import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityStaff } from '../../entities/communityStaff.entity';
import { CommunityStaffsController } from './community-staffs.controller';

// Commands (增删改操作)
import { CreateCommunityStaffService } from './commands/create-community-staff/create-community-staff.service';
import { UpdateCommunityStaffService } from './commands/update-community-staff/update-community-staff.service';
import { DeleteCommunityStaffService } from './commands/delete-community-staff/delete-community-staff.service';
import { BindPasskeyCommunityStaffService } from './commands/bindpasskey-community-staff/bindpasskey-community-staff.service';
import { EnableCommunityStaffService } from './commands/enable-community-staff/enable-community-staff.service';

// Queries (查询操作)
import { GetCommunityStaffService } from './queries/get-community-staff/get-community-staff.service';
import { ListCommunityStaffsService } from './queries/list-community-staffs/list-community-staffs.service';
import { SearchCommunityStaffsService } from './queries/search-community-staffs/search-community-staffs.service';

// Shared
import { CommunityStaffRepository } from './shared/community-staff.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityStaff])],
  controllers: [CommunityStaffsController],
  providers: [
    // Shared
    CommunityStaffRepository,

    // Commands
    CreateCommunityStaffService,
    UpdateCommunityStaffService,
    DeleteCommunityStaffService,
    BindPasskeyCommunityStaffService,
    EnableCommunityStaffService,

    // Queries
    GetCommunityStaffService,
    ListCommunityStaffsService,
    SearchCommunityStaffsService,
  ],
  exports: [CommunityStaffRepository],
})
export class CommunityStaffsModule {}
