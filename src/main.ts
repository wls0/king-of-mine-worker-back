import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { ErrorExceptionFilter } from './common/filters/error.exception';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  if (process.env.NODE_ENV === 'product') {
    app.use(
      ['/docs'],
      expressBasicAuth({
        challenge: true,
        users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('광부왕')
    .setDescription('king-of-mine-worker-back Api')
    .setVersion(process.env.VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
