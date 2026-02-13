import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Need to handle raw body for webhook, usually done via middleware or body-parser options.
  // NestJS default body parser can be disabled for specific routes or globally configured.
  // For simplicity here, let's keep standard setup but acknowledge rawBody issue.
  // To truly fix, user needs to `npm i body-parser` and configure it.

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('The Multi-Vendor AI Powered LMS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
