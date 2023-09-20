import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UpdateDto } from 'src/dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(user: User, dto: UpdateDto): Promise<string> {
    const { password, oldPassword, twoFAActivated, ...otherFields } = dto;

    if (password) {
      if (user.isFourtyTwoStudent)
        throw new ForbiddenException("Can't change 42 password");

      if (oldPassword === undefined)
        throw new ForbiddenException('Old password is required');

      const passwordMatches = await argon.verify(user.password, oldPassword);
      if (!passwordMatches)
        throw new ForbiddenException('Old password is incorrect');

      const hash = await argon.hash(dto.password);
      this.updatePassword(user, hash);
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: otherFields,
    });

    if (dto.twoFAActivated && !user.twoFASecret) {
      const otpauthUrl = await this.generate2FASecret(user);
      if (!user.achievements.includes('TWOFA')) {
        user.achievements.push('TWOFA');
        // emit notification achievement?
      }
      return await toDataURL(otpauthUrl);
    } else if (dto.twoFAActivated === false) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          twoFASecret: null,
          twoFAActivated: false,
        },
      });
    }
    return 'OK';
  }

  async updatePassword(user: User, hashNewPassword: string) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashNewPassword,
      },
    });
  }

  private async generate2FASecret(user: User): Promise<string> {
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFASecret: secret,
      },
    });
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'PongStoryShort',
      secret,
    );
    return otpauthUrl;
  }

  async getAllUsers(): Promise<Object> {
    const allUserData = await this.prisma.user.findMany({
      select: {
        userName: true,
        avatar: true,
        status: true,
        gamesWon: true,
        gamesLost: true,
        ranking: true,
      },
    });
    return allUserData;
  }
}
