// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; // 生成请求ID（npm install uuid）
import { ApiResponse } from '../interface/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // 生成请求ID（挂载到请求对象，便于异常过滤器复用）
    const request = context.switchToHttp().getRequest();
    const requestId = uuidv4();
    request.requestId = requestId;

    return next.handle().pipe(
      map((data) => ({
        code: 200, // 成功默认业务码
        message: '操作成功', // 默认提示语（可被控制器覆盖）
        data: data ?? null, // 无数据时返回null
        requestId,
        timestamp: Date.now(),
      })),
    );
  }
}
