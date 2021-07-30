import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common';

const logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:GHzisd8Jg5Mw@34.227.176.156:5672/smartranking'],
      noAck: false,
      queue: 'admin-backend'
    },
  });

  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
