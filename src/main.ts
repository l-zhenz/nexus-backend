import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorResponse, SuccessResponse } from './utils/response';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j2';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SuccessResponse());
  app.useGlobalFilters(new ErrorResponse());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Nexus Admin')
    .setDescription('API文档')
    .setVersion('1.0')
    .addTag('nexus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await knife4jSetup(app, [
    {
      name: '1.0 version',
      url: `/api-json`,
      swaggerVersion: '1.0',
      location: `/api-json`,
    },
  ]);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
