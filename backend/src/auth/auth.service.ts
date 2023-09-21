import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto, LoginDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TwoFA } from './strategy';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import axios from 'axios';
import { readFileSync } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private twoFA: TwoFA,
  ) {}

  async fourtyTwoLogin(res: any, dto: AuthDto, accessToken: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { userName: dto.userName }],
      },
    });

    // Maybe set up a "compound unique constraint" can avoid repeatetive requests.
    // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1

    if (!user) {
      try {
        user = await this.prisma.user.create({
          data: {
            id: dto.id,
            email: dto.email,
            userName: dto.userName,
            avatar: await this.fetchImageFromURL(dto.image),
            isFourtyTwoStudent: true,
            password: dto.password,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
    console.log('auth 42 login: ', user.userName);

    if (!user || user.isFourtyTwoStudent === false) {
      res.redirect('http://localhost:8080');
      return;
    }

    if (user.twoFAActivated) {
      return { redirect: '/2fa-verify' };
    }
    await this.updateAfterLogin(user, res);
  }

  async localSignup(res: any, dto: AuthDto) {
    let token: string;
    try {
      const hash = await argon.hash(dto.password);
      const imageBase64 = this.fetchImageFromFile('defaultAvatar.jpg');
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          userName: dto.userName,
          password: hash,
          avatar: imageBase64,
        },
      });
      token = await this.signToken(user.id, user.email);
      res.cookie('jwt', token).send({ status: 'logged in' });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
    }
  }

  async localLogin(dto: LoginDto, res: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    if (user.isFourtyTwoStudent)
      throw new ForbiddenException('Log in through OAuth only');

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    if (user.twoFAActivated) {
      return { redirect: '/2fa-verify' };
    }
    await this.updateAfterLogin(user, res);
    return user;
  }

  async handleLogout(user: User, res: any, req: any) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'OFFLINE',
      },
    });

    const token = req.cookies.jwt;
    if (token) {
      this.addToBlacklist(user.id, token);
    }

    res.clearCookie('jwt').redirect('http://localhost:8080');
  }

  async twoFAVerify(user: User, res: any, payload: any) {
    try {
      const validatedUser = await this.twoFA.validate(
        user.userName,
        payload.code,
      );
      if (validatedUser) {
        if (user.twoFAActivated) {
          this.updateAfterLogin(user, res);
        } else {
          await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              twoFAActivated: true,
            },
          });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  signToken(id: string, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '90m',
      secret: secret,
    });
  }

  async fetchImageFromURL(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      if (response.status === 200) {
        const imageBuffer = Buffer.from(response.data, 'binary');
        const returnString = imageBuffer.toString('base64');
        return returnString;
      }
    } catch (error) {
      throw new NotFoundException('Could not load profile picture.');
    }
    return null;
  }

  fetchImageFromFile(fileName: string) {
    try {
      const imageBuffer = readFileSync(fileName);
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      return imageBase64;
    } catch (error) {
      throw new Error('Error reading image file: ${error.message}');
    }
  }

  async addToBlacklist(userID: string, token: string): Promise<void> {
    await this.prisma.jwtBlacklist.upsert({
      where: { userID },
      update: { token },
      create: { token, userID },
    });
  }

  async updateAfterLogin(user: User, res: any) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'ONLINE',
      },
    });

    const token = await this.signToken(user.id, user.email);
    if (user.isFourtyTwoStudent) {
      res.cookie('jwt', token).redirect('/');
    } else {
      res.cookie('jwt', token).send({ status: 'logged in' });
    }
  }
}
