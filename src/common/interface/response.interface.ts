// src/common/interface/response.interface.ts
/**
 * 统一响应格式
 */
export interface ApiResponse<T = any> {
  /** 业务状态码（200=成功，非200=失败） */
  code: number;
  /** 提示信息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 请求ID（用于排查问题，可选） */
  requestId?: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 分页响应格式（继承基础格式）
 */
export interface ApiPageResponse<T = any> {
  /** 列表数据 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总页数 */
  pageSize: number;
}
