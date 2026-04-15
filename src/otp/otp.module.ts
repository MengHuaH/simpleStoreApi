import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { SmsService } from './sms.service';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]), // 不需要实体，因为使用Redis
    CacheModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, SmsService],
  exports: [OtpService, SmsService],
})
export class OtpModule {}