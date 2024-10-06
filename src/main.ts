import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { ENV_KEYS } from './common/constants/config.constant';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AllExceptionsFilter } from './filters';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL verification

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(
    ConfigService<Record<keyof typeof ENV_KEYS, unknown>>,
  );

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.getOrThrow('API_PREFIX'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.getOrThrow('API_VERSION'),
  });
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(3000);
}
bootstrap();
