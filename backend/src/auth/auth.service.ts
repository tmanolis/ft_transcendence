import {
  ForbiddenException,
	Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthDto, EnableTwoFADTO, LoginDto, VerifyTwoFADTO } from '../dto';
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
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
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

    if (!user || user.isFourtyTwoStudent === false) {
      return res.status(500).json({ message: '42 login failed' });
    }

    if (user.twoFAActivated) {
      return res.send({ event: '2fa needed', userName: user.userName });
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
      await this.updateAfterLogin(user, res);
      return user;
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
			const nonce = this.generateRandomNonce(16);
			await this.cacheManager.set(nonce, user.userName);
      return res.send({ event: '2fa needed', nonce: nonce });
    }
    await this.updateAfterLogin(user, res);
    return user;
  }

	generateRandomNonce(length: number){
		const crypto = require('crypto');
		return crypto.randomBytes(length).toString('hex');
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

    res.clearCookie('jwt').send({ status: 'logged out' });
  }

  async twoFAVerify(res: any, dto: VerifyTwoFADTO) {
    try {
			const username: string = await this.cacheManager.get(dto.nonce);
      const user = await this.prisma.user.findUnique({
        where: {
          userName: username,
        },
      });

      const validatedUser = await this.twoFA.validate(user.userName, dto.code);

      if (validatedUser) {
        this.updateAfterLogin(user, res);
				return res.send({ event: '2fa ok' });
			}
    } catch (error) {
      throw new Error(error.message);
    }
  }

	async twoFAEnable(user: User, res: any, dto: EnableTwoFADTO) {
    try {
      const validatedUser = await this.twoFA.validate(user.userName, dto.code);

      if (validatedUser) {
				await this.prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						twoFAActivated: true,
					},
				});
			}
			return res.send({ event: '2fa ok' });
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
