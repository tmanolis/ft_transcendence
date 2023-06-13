import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TwoFA } from './strategy';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
	private twoFA: TwoFA,
  ) {}

  async fourtyTwoLogin(res: any, dto: AuthDto, accessToken: string) {
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
            password: dto.password,
          },
        });
      } catch (error) {
        throw error;
      }
    }
    if (user.twoFAActivated) {
		const payload = {
		  username: user.userName,
		  code: dto.twoFACode,
		}
		return await this.twoFA.validate(payload);
	  }
    const token = await this.signToken(user.id, user.email);
    res.cookie('jwt', token, '42accesToken', accessToken).redirect('/hello');
  }

  async localSignup(res: any, dto: AuthDto) {
    let token: string;
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          userName: dto.userName,
          password: hash,
        },
      });
      token = await this.signToken(user.id, user.email);
      res.cookie('jwt', token).redirect('/hello');
    } catch (error) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
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

    if (user.isFourtyTwoStudent) throw new ForbiddenException('Log in through OAuth only');

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    if (user.twoFAActivated) {
      const payload = {
        username: user.userName,
        code: dto.twoFACode,
      }
      return await this.twoFA.validate(payload);
    }
    delete user.password;
    return user;
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
