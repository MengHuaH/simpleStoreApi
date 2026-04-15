import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { BusinessException } from './common/exceptions/business.exception';

declare const module: any;

async function bootstrap() {
  await ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  });

  const app = await NestFactory.create(AppModule);
  // 全局拦截器（响应格式化）
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器（捕获业务异常）
  app.useGlobalFilters(new GlobalExceptionFilter());
  // 可选：全局参数校验（配合class-validator，返回友好参数错误）
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换参数类型
      whitelist: true, // 过滤非预期字段
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        // 格式化参数校验错误信息
        const messages = errors.map((err) => {
          return `${err.property}：${Object.values(err.constraints!).join('、')}`;
        });
        return new BusinessException(`参数错误：${messages.join('；')}`, 400);
      },
    }),
  );

  // 启用CORS
  app.enableCors({
    origin: true, // 允许所有来源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Simple Store API')
    .setDescription('The Simple Store API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  console.log(`env: ${process.env.NODE_ENV}`);
}
bootstrap();
