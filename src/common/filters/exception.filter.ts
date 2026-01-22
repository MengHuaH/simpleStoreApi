// src/common/filters/exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ApiResponse } from '../interface/response.interface';
import { v4 as uuidv4 } from 'uuid';

@Catch() // 捕获所有异常（包括系统异常、自定义异常）
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. 基础响应结构
    const result: ApiResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '服务器内部错误',
      data: null,
      requestId: request.header('request-id') || uuidv4(), // 从header获取请求ID（无则生成）
      timestamp: Date.now(),
    };

    // 2. 区分异常类型处理
    if (exception instanceof BusinessException) {
      // 自定义业务异常（友好提示）
      result.code = exception.getCode();
      result.message = exception.getResponse() as string;
      this.logger.warn(`[业务异常] ${result.requestId} - ${result.message}`);
    } else if (exception instanceof HttpException) {
      // Nest内置HTTP异常（如404、403）
      const status = exception.getStatus();
      result.code = status;
      result.message =
        (exception.getResponse() as { message: string }).message ||
        exception.message;
      this.logger.warn(
        `[HTTP异常] ${result.requestId} - ${status}：${result.message}`,
      );
    } else {
      // 系统异常（生产环境屏蔽详细信息）
      this.logger.error(
        `[系统异常] ${result.requestId}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      // 开发环境返回详细错误，生产环境返回通用提示
      const isProd = process.env.NODE_ENV === 'production';
      result.message = isProd ? '服务器内部错误' : (exception as Error).message;
    }

    // 3. 返回统一格式
    response.status(HttpStatus.OK).json(result);
  }
}
