import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

// SSL cert
const keyFile  = fs.readFileSync('/etc/ssl/private.key');
const certFile  = fs.readFileSync('/etc/ssl/certificate.crt');


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
    }
  });
  await app.listen(3000);
}
bootstrap();
