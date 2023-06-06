import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async fourtyTwoLogin(res: any, dto: AuthDto) {
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

  async localSignup(res: any, dto: AuthDto) {
    let token: string;
    try {
      const hash = await argon.hash(dto.hash);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          userName: dto.userName,
          hash,
        },
      });
      token = await this.signToken(user.id, user.email);
      res.cookie('jwt', token).redirect('/hello');
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }    
    return token;
  }

  async localLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    
    if (!user) throw new ForbiddenException('User not found');

    const passwordMatches = await argon.verify(user.hash, dto.hash);

    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    return 'OK';
  }  

  signToken(id: string, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn:	'90m',
      secret: secret,
    });
  }


}
