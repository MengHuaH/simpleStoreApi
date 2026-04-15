import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/auth/AllowAnon.decorator';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '发送OTP验证码',
    description: '发送OTP验证码到指定手机号',
  })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  @ApiResponse({ status: 400, description: '请求参数错误或冷却期内' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.otpService.sendOtp(sendOtpDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '验证OTP验证码',
    description: '验证OTP验证码是否正确',
  })
  @ApiResponse({ status: 200, description: '验证码验证成功' })
  @ApiResponse({ status: 400, description: '验证码错误或已过期' })
  @ApiResponse({ status: 404, description: '验证码不存在' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.otpService.verifyOtp(verifyOtpDto);
  }

  @Post('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取OTP状态',
    description: '获取指定手机号的OTP验证码状态',
  })
  @ApiResponse({ status: 200, description: '获取状态成功' })
  async getOtpStatus(
    @Body()
    statusDto: {
      phone: string;
      subjectType: string;
      scenario?: string;
    },
  ) {
    return await this.otpService.getOtpStatus(
      statusDto.phone,
      statusDto.subjectType as any,
      statusDto.scenario,
    );
  }
}
