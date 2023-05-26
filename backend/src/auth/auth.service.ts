import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async handle42Login(res: any, dto: AuthDto) {
    let user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      try {
        user = await this.prisma.user.create({
          data: {
            id: dto.id,
            email: dto.email,
            userName: dto.userName,
            avatar: dto.image,
            isFourtyTwoStudent: true,
            hash: dto.hash,
          },
        });
      } catch (error) {
        throw error;
      }
    } else {
      user.hash = dto.hash;
    }
    const token = await this.signToken(user.id, user.email);
    res.cookie('jwt', token, '42accesToken', user.hash).redirect('/hello');
  }

  signToken(id: string, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      // Uncomment next line as soon as refresh token is implemented:
      // expiresIn:	'15m',
      secret: secret,
    });
  }
}
