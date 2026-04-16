// src/common/decorators/api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiResponse as ApiResponseSwagger,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponse } from '../interface/response.interface';

// 基础响应 Swagger 模型（无泛型）
export class ApiResponseDto implements ApiResponse<any> {
  @ApiProperty({ example: 200, description: '业务状态码' })
  code: number;

  @ApiProperty({ example: '操作成功', description: '提示信息' })
  message: string;

  @ApiProperty({
    description: '响应数据',
    type: 'object',
    additionalProperties: true,
  })
  data: any;

  @ApiProperty({
    example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
    description: '请求ID',
  })
  requestId?: string;

  @ApiProperty({ example: 1735000000000, description: '时间戳' })
  timestamp: number;
}

// 泛型响应 DTO 工厂函数
export function createApiResponseDto<T>(model: Type<T>): Type<ApiResponse<T>> {
  class GenericApiResponseDto implements ApiResponse<T> {
    @ApiProperty({ example: 200, description: '业务状态码' })
    code: number;

    @ApiProperty({ example: '操作成功', description: '提示信息' })
    message: string;

    @ApiProperty({
      description: '响应数据',
      type: model,
    })
    data: T;

    @ApiProperty({
      example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
      description: '请求ID',
    })
    requestId?: string;

    @ApiProperty({ example: 1735000000000, description: '时间戳' })
    timestamp: number;
  }

  return GenericApiResponseDto;
}

// 自定义装饰器：简化 Swagger 响应配置
export const ApiSuccessResponse = <TModel extends Type<any>>({
  model,
  description = '操作成功',
}: {
  model?: TModel;
  description?: string;
}) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        properties: {
          code: { example: 200 },
          data: { $ref: getSchemaPath(model as TModel) },
          message: { example: '操作成功' },
          requestId: {
            example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
          },
          timestamp: { example: 1735000000000 },
        },
      },
    }),
  );
};

export const ApiCreatedSuccessResponse = <TModel extends Type<any>>({
  model,
  description = '操作成功',
}: {
  model?: TModel;
  description?: string;
}) => {
  return applyDecorators(
    ApiResponseSwagger({
      status: 201,
      description,
      schema: {
        properties: {
          code: { example: 201 },
          data: { $ref: getSchemaPath(model as TModel) },
          message: { example: '操作成功' },
          requestId: {
            example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
          },
          timestamp: { example: 1735000000000 },
        },
      },
    }),
  );
};

export const ApiCustomizeResponse = <TModel extends Type<any>>({
  model,
  description = '操作成功',
  type,
  code,
}: {
  type?: 'string' | 'object';
  model?: TModel;
  description?: string;
  code?: number;
}) => {
  return applyDecorators(
    ApiResponseSwagger({
      status: code || 201,
      description,
      schema: {
        properties: {
          code: { example: code || 201 },
          data: !type
            ? { example: type }
            : { $ref: getSchemaPath(model as TModel) },
          message: { example: '操作成功' },
          requestId: {
            example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
          },
          timestamp: { example: 1735000000000 },
        },
      },
    }),
  );
};

export const ApiCustomizeSuccessResponse = ({
  type,
  description = '操作成功',
}: {
  type?: 'string' | 'object';
  description?: string;
}) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        properties: {
          code: { example: 200 },
          data: { example: type, type: type },
          message: { example: '操作成功' },
          requestId: {
            example: 'f5a7b9c8-1234-5678-90ab-cdef12345678',
          },
          timestamp: { example: 1735000000000 },
        },
      },
    }),
  );
};
