/**
 * API 响应包装器
 * 用于处理 NSwag 生成的客户端代码中的状态码问题
 */
export class ApiResponse<T = any> {
  /**
   * 响应状态码
   */
  status: number;

  /**
   * 响应数据
   */
  data?: T;

  /**
   * 响应头
   */
  headers: { [key: string]: any };

  /**
   * 创建 API 响应实例
   */
  constructor(status: number, data?: T, headers: { [key: string]: any } = {}) {
    this.status = status;
    this.data = data;
    this.headers = headers;
  }

  /**
   * 检查响应是否成功
   * 包括 200, 201, 202, 204 等状态码
   */
  get isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }

  /**
   * 获取响应数据
   * 如果响应不成功，抛出异常
   */
  get result(): T {
    if (!this.isSuccess) {
      throw new Error(`API 调用失败，状态码: ${this.status}`);
    }
    return this.data as T;
  }

  /**
   * 静态方法：创建成功响应
   */
  static success<T>(data: T, status = 200): ApiResponse<T> {
    return new ApiResponse(status, data);
  }

  /**
   * 静态方法：创建错误响应
   */
  static error(status: number, message: string): ApiResponse<null> {
    return new ApiResponse(status, null, { message });
  }
}

/**
 * API 异常类
 */
export class ApiException extends Error {
  /**
   * 状态码
   */
  status: number;

  /**
   * 响应数据
   */
  response: string;

  /**
   * 响应头
   */
  headers: { [key: string]: any };

  /**
   * 创建 API 异常实例
   */
  constructor(message: string, status: number, response: string, headers: { [key: string]: any } = {}) {
    super(message);
    this.status = status;
    this.response = response;
    this.headers = headers;
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return `ApiException: ${this.message} (Status: ${this.status})`;
  }
}