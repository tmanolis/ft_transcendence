import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UpdateDto } from 'src/auth/dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(user: User, dto: UpdateDto): Promise<string> {
    if (dto.password){
      if (user.isFourtyTwoStudent)
        throw new ForbiddenException("Can't change 42 password");
      const hash = await argon.hash(dto.password);
      dto.password = hash;
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: dto,
    });
    if (dto.twoFAActivated && !user.twoFASecret) {
      const otpauthUrl = await this.generate2FASecret(user);
      return await toDataURL(otpauthUrl);
    }
    else if (!dto.twoFAActivated && user.twoFASecret) {
      user.twoFASecret = null;
    }
    return 'OK';
  }

  private async generate2FASecret(user: User): Promise<string> {
    const secret = authenticator.generateSecret();
	await this.prisma.user.update ({
		where: {
			id: user.id,
		},
		data: {
			twoFASecret: secret,
		},
	})
    const otpauthUrl = authenticator.keyuri(user.email, 'PongStoryShort', secret);
    return otpauthUrl;
  }
}
