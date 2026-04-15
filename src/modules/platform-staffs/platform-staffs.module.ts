import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformStaff } from '../../entities/platformStaff.entity';
import { PlatformStaffsController } from './platform-staffs.controller';

// Commands (增删改操作)
import { CreatePlatformStaffService } from './commands/create-platform-staff/create-platform-staff.service';
import { UpdatePlatformStaffService } from './commands/update-platform-staff/update-platform-staff.service';
import { DeletePlatformStaffService } from './commands/delete-platform-staff/delete-platform-staff.service';
import { BindPasskeyPlatformStaffService } from './commands/bindpasskey-platform-staff/bindpasskey-platform-staff.service';

// Queries (查询操作)
import { GetPlatformStaffService } from './queries/get-platform-staff/get-platform-staff.service';
import { ListPlatformStaffsService } from './queries/list-platform-staffs/list-platform-staffs.service';
import { SearchPlatformStaffsService } from './queries/search-platform-staffs/search-platform-staffs.service';

// Shared
import { PlatformStaffRepository } from './shared/platform-staff.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformStaff])],
  controllers: [PlatformStaffsController],
  providers: [
    // Shared
    PlatformStaffRepository,

    // Commands
    CreatePlatformStaffService,
    UpdatePlatformStaffService,
    DeletePlatformStaffService,
    BindPasskeyPlatformStaffService,

    // Queries
    GetPlatformStaffService,
    ListPlatformStaffsService,
    SearchPlatformStaffsService,
  ],
  exports: [PlatformStaffRepository],
})
export class PlatformStaffsModule {}
