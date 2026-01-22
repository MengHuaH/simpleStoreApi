// src/common/exceptions/business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 自定义业务异常（如参数错误、权限不足）
 */
export class BusinessException extends HttpException {
  /** 业务状态码 */
  private readonly businessCode: number;

  constructor(
    message: string,
    businessCode = 400, // 默认业务码
    statusCode: HttpStatus = HttpStatus.OK, // HTTP状态码默认200（前端统一解析业务码）
  ) {
    super(message, statusCode);
    this.businessCode = businessCode;
  }

  getCode(): number {
    return this.businessCode;
  }
}
