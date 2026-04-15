import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { AdminSessionsController } from './admin-sessions.controller';
import { SessionRepository } from './shared/session.repository';
import { SessionService } from './shared/session.service';
import { GetSessionsService } from './queries/get-sessions/get-sessions.service';
import { LogoutSessionService } from './commands/logout-session/logout-session.service';
import { ListAllSessionsService } from './queries/list-all-sessions/list-all-sessions.service';
import { AdminLogoutSessionService } from './commands/admin-logout-session/admin-logout-session.service';
import { UserSession } from '@/entities/userSession.entity';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), CacheModule],
  controllers: [SessionsController, AdminSessionsController],
  providers: [
    SessionRepository,
    SessionService,
    GetSessionsService,
    LogoutSessionService,
    ListAllSessionsService,
    AdminLogoutSessionService,
  ],
  exports: [SessionService],
})
export class SessionsModule {}
