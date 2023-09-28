import { Test, TestingModule } from '@nestjs/testing';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { GameService } from './game.service';
import { PrismaModule } from 'nestjs-prisma';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      providers: [
        GameService,
        { provide: CACHE_MANAGER, useValue: {} },
        JwtService,
      ],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });
});
