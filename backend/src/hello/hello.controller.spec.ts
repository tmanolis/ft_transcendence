import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'nestjs-prisma';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [HelloController],
      providers: [HelloService, PrismaService],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
