import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from './hello.service';
import { PrismaModule } from 'nestjs-prisma';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [HelloService],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getHello', () => {
    it('should return OK!', () => {
      service.getHello();
    });
  });
});
