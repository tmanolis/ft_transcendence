import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UpdateDto } from 'src/auth/dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(user: User, dto: UpdateDto) {
    if (user.isFourtyTwoStudent) {
      await this.prisma.user.update ({
        where: {
          id: user.id,
        },
        data: {
          avatar: dto.avatar,
          userName: dto.userName,
        }
      })
    }
    else {
      const hash = await argon.hash(dto.password);
      await this.prisma.user.update ({
        where: {
          id: user.id,
        },
        data: {
          avatar: dto.avatar,
          userName: dto.userName,
          hash,
        }
      })     
    }
  }
}
