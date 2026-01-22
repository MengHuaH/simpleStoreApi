// src/common/utils/response.util.ts
import { ApiResponse } from '../interface/response.interface';

/**
 * 自定义响应结果
 * @param data 响应数据
 * @param message 提示语
 * @param code 业务状态码
 */
export const successResponse = <T = any>(
  data: T,
  message = '操作成功',
  code = 200,
): ApiResponse<T> => {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
  };
};

/**
 * 分页响应结果
 * @param list 列表数据
 * @param total 总数
 * @param page 当前页
 * @param pageSize 每页条数
 * @param message 提示语
 */
export const pageResponse = <T = any>(
  list: T[],
  total: number,
  page: number,
  limit: number,
  pageSize: number,
) => {
  return {
    list,
    total,
    page,
    limit,
    pageSize,
  };
};
