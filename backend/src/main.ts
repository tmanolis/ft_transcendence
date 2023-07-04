import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// import * as fs from 'fs';

// SSL cert
// const keyFile  = fs.readFileSync('/etc/ssl/private.key');
// const certFile  = fs.readFileSync('/etc/ssl/certificate.crt');

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // settings for https
    // , { httpsOptions: { key: keyFile, cert: certFile, } }
  );

  // swagger config and integration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('ft_transcendence API description')
    .setVersion('0.01')
    .addTag('ft_transcendence')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // adding validation pipes globally and using the whitelist option
  // as a security matter - any extra information that is injected
  // into the dto will be disregarded
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  const cors = {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost',
      '*',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  };
  app.enableCors(cors);

  await app.listen(3000);
}
bootstrap();
