import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthMemberService } from './auth-member/auth-member.service';
import { AuthCommunityStaffService } from './auth-community-staff/auth-community-staff.service';
import { AuthPlatformStaffService } from './auth-platform-staff/auth-platform-staff.service';
import { AuthLogoutService } from './shared/auth-logout.service';
import { PasskeyService } from './shared/passkey.service';
import { OtpModule } from '@/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@/cache/cache.module';
import { ConfigModule } from '@nestjs/config';

// 引入实体类
import {
  Member,
  CommunityStaff,
  PlatformStaff,
  UserCredential,
  UserSession,
} from '@/entities';

// 引入成员模块
import { MembersModule } from '@/modules/members/members.module';
// 引入社区员工模块
import { CommunityStaffsModule } from '@/modules/community-staffs/community-staffs.module';
// 引入平台员工模块
import { PlatformStaffsModule } from '@/modules/platform-staffs/platform-staffs.module';
// 引入会话模块
import { SessionsModule } from '@/modules/sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      CommunityStaff,
      PlatformStaff,
      UserCredential,
      UserSession,
    ]),
    MembersModule,
    CommunityStaffsModule,
    PlatformStaffsModule,
    OtpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    CacheModule,
    ConfigModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthMemberService,
    AuthCommunityStaffService,
    AuthPlatformStaffService,
    AuthLogoutService,
    PasskeyService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [
    AuthMemberService,
    AuthCommunityStaffService,
    AuthPlatformStaffService,
  ],
})
export class AuthModule {}
