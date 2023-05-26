import {
  Injectable,
  HttpException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RedisCache } from 'cache-manager-redis-yet';

@Injectable()
export class HelloService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
  ) {}

  async getHello(): Promise<string> {
    let cachedData = await this.cacheManager.get('heyhey');
    console.log(cachedData);
    await this.cacheManager.set('heyhey', 'room');
    cachedData = await this.cacheManager.get('heyhey');
    console.log(cachedData);
    const createUser = await this.prisma.user.create({
      data: {
        email: 'test@email.com',
        userName: 'test',
        password: 'myPass',
      },
    });

    const findUser = await this.prisma.user.findUnique({
      where: {
        email: 'test@email.com',
      },
    });
    if (!findUser || !findUser.id)
      throw new HttpException('User not found.', 404);

    const deleteUser = await this.prisma.user.delete({
      where: {
        email: 'test@email.com',
      },
    });
    if (!deleteUser || !deleteUser.id)
      throw new HttpException('Nothing to delete', 404);

    const game = await this.prisma.game.findMany({
      where: {
        gameId: { not: 0 },
      },
    });

    //console.log('find U:', findUser);
    //console.log('game:', game);
    //console.log('d user:', deleteUser);
    return 'OK!';
  }
}
