import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //   async createFourtyTwoUser(
  //     email: string,
  //     userName: string,
  //     fourtyTwoLogin: string,
  //     password: string,
  //   ): Promise<string> {
  //     const response = await this.prisma.user.create({
  //       data: {
  //         email: email,
  //         userName: fourtyTwoLogin,
  //         password: password,
  //         isFourtyTwoStudent: true,
  //       },
  //     });
  //     return '42 user created!\n';
  //   }

  //   async createNormalUser(
  //     email: string,
  //     userName: string,
  //     password: string,
  //   ): Promise<string> {
  //     const response = await this.prisma.user.create({
  //       data: {
  //         email: email,
  //         userName: userName,
  //         password: password,
  //       },
  //     });
  //     return 'normal user created!';
  //   }

  async getUser(): Promise<string> {
    return 'user';
  }
}
