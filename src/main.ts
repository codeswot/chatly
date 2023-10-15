import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for the Express app
  app.enableCors({
    origin: true,
  });

  const port = process.env.PORT || 5005;
  const host = '0.0.0.0';
  const config = new DocumentBuilder()
    .setTitle('Chatly')
    .setDescription('The Chatly API')
    .setVersion('1.0')
    .addTag('chats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
