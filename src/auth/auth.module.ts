import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUserService } from './auth-user/auth-user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '@/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthUserService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthUserService],
})
export class AuthModule {}
