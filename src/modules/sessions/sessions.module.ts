import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { AdminSessionsController } from './admin-sessions.controller';
import { SessionRepository } from './shared/session.repository';
import { SessionService } from './shared/session.service';
import { GetSessionsService } from './queries/get-sessions/get-sessions.service';
import { GetSessionStatsService } from './queries/get-session-stats/get-session-stats.service';
import { CheckSessionService } from './queries/check-session/check-session.service';
import { LogoutSessionService } from './commands/logout-session/logout-session.service';
import { ListAllSessionsService } from './queries/list-all-sessions/list-all-sessions.service';
import { AdminLogoutSessionService } from './commands/admin-logout-session/admin-logout-session.service';
import { UserSession } from '@/entities/userSession.entity';
import { Member } from '@/entities/member.entity';
import { PlatformStaff } from '@/entities/platformStaff.entity';
import { CommunityStaff } from '@/entities/communityStaff.entity';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSession,
      Member,
      PlatformStaff,
      CommunityStaff,
    ]),
    CacheModule,
  ],
  controllers: [SessionsController, AdminSessionsController],
  providers: [
    SessionRepository,
    SessionService,
    GetSessionsService,
    GetSessionStatsService,
    CheckSessionService,
    LogoutSessionService,
    ListAllSessionsService,
    AdminLogoutSessionService,
  ],
  exports: [SessionService],
})
export class SessionsModule {}
