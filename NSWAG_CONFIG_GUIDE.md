# NSwag Studio 配置指南

## 问题描述
NSwag Studio 默认将 201 (Created) 状态码视为错误，但我们的 API 设计遵循 RESTful 原则，登录操作应该返回 201 状态码。

## 解决方案

### 1. 更新 NSwag 配置文件
我们已经修改了 `api.nswag` 文件，添加了以下关键配置：

```json
{
  "wrapResponses": true,
  "successResponseCodes": ["200", "201", "202", "204"],
  "responseClass": "ApiResponse",
  "wrapResponseMethods": ["*"],
  "exceptionClass": "ApiException",
  "exceptionClassPath": "../src/client/api-response",
  "responseClassPath": "../src/client/api-response"
}
```

### 2. 自定义响应包装器
创建了 `src/client/api-response.ts` 文件，包含：
- `ApiResponse` 类：包装所有 API 响应
- `ApiException` 类：处理 API 异常

### 3. 在 NSwag Studio 中应用配置

#### 方法一：导入配置文件
1. 打开 NSwag Studio
2. 点击 **File** → **Load Configuration**
3. 选择 `api.nswag` 文件
4. 点击 **Generate** 生成客户端代码

#### 方法二：手动设置（如果导入失败）
在 NSwag Studio 界面中手动设置以下选项：

**Settings 选项卡：**
- ✅ Generate Client Classes
- ✅ Generate DTO Types
- ✅ Generate Response Classes
- ✅ Wrap Responses

**Response 设置：**
- Response Class: `ApiResponse`
- Exception Class: `ApiException`
- Success Response Codes: `200,201,202,204`
- Wrap Response Methods: `*` (所有方法)

**TypeScript 设置：**
- Exception Class Path: `../src/client/api-response`
- Response Class Path: `../src/client/api-response`

### 4. 生成的客户端代码使用示例

```typescript
import { AuthClient } from './api-client';
import { ApiResponse } from '../src/client/api-response';

const authClient = new AuthClient();

// 使用包装后的响应
const response: ApiResponse<LoginResult> = await authClient.login(loginRequest);

if (response.isSuccess) {
  // 201 状态码现在会被视为成功
  const loginResult = response.result;
  console.log('登录成功:', loginResult);
} else {
  console.error('登录失败，状态码:', response.status);
}
```

## 配置说明

### `wrapResponses: true`
- 启用响应包装，所有 API 调用都会返回 `ApiResponse` 对象
- 避免直接抛出异常，让开发者可以手动处理不同状态码

### `successResponseCodes: ["200", "201", "202", "204"]`
- 明确指定哪些状态码应该被视为成功
- 包括 201 (Created) 状态码

### `responseClass: "ApiResponse"`
- 使用自定义的响应包装器类
- 提供统一的 API 响应处理接口

### `wrapResponseMethods: ["*"]`
- 对所有 API 方法都启用响应包装
- 确保一致性

## 优势

1. **符合 RESTful 设计**：保持 201 状态码的正确使用
2. **更好的错误处理**：开发者可以灵活处理不同状态码
3. **类型安全**：TypeScript 类型检查
4. **一致性**：所有 API 调用使用相同的响应格式

## 注意事项

1. **路径配置**：确保 `exceptionClassPath` 和 `responseClassPath` 的路径正确
2. **导入顺序**：在生成客户端代码前，先确保自定义类文件存在
3. **测试验证**：生成后测试 201 状态码是否被正确处理

## 故障排除

如果配置不生效，检查：
1. NSwag Studio 版本是否支持这些配置项
2. 路径配置是否正确
3. 自定义类文件是否可访问
4. 重新加载配置文件或重启 NSwag Studio