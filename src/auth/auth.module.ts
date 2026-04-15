import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUserService } from './auth-user/auth-user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MembersModule } from '@/modules/members/members.module';
import { Member } from '@/entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@/cache/cache.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    MembersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    CacheModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthUserService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthUserService],
})
export class AuthModule {}
