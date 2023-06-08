import { Injectable, HttpException, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UpdateDto } from 'src/auth/dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(user: User, dto: Partial<UpdateDto>) {
    if (dto.hash) {
      if (user.isFourtyTwoStudent)
        throw new ForbiddenException("Can't change 42 password");
      const hash = await argon.hash(dto.hash);
      dto.hash = hash;
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: dto,
    });
  }
}
