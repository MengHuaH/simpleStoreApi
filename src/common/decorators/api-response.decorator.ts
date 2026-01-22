// src/common/decorators/api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ApiResponse } from '../interface/response.interface';

// 基础响应 Swagger 模型
export class ApiResponseDto<T = any> implements ApiResponse<T> {
  @ApiProperty({ example: 200, description: '业务状态码' })
  code: number;

  @ApiProperty({ example: '操作成功', description: '提示信息' })
  message: string;

  @ApiProperty({ description: '响应数据' })
  data: T;

  @ApiProperty({
    example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
    description: '请求ID',
  })
  requestId?: string;

  @ApiProperty({ example: 1735000000000, description: '时间戳' })
  timestamp: number;
}

// 自定义装饰器：简化 Swagger 响应配置
export const ApiSuccessResponse = <TModel extends Type<any>>(
  model?: TModel,
  description = '操作成功',
) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          model
            ? {
                properties: {
                  data: { $ref: getSchemaPath(model) },
                },
              }
            : {},
        ],
      },
    }),
  );
};
