import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async createFourtyTwoUser(
    email: string, userName: string, fourtyTwoLogin: string, password: string
  ): Promise<string> {
    const response = await this.prisma.user.create({
      data: {
        email: email,
	userName: userName,
	fourtyTwoLogin: string,
	password: string,
	ifFourtyTwoStudent: true,
      },
    })
  }

  async createNormalUser(
    email: string, userName: string, password: string
  ): Promise<string> {
    const response = await this.prisma.user.create({
      data: {
        email: email,
	userName: userName,
	password: string,
      },
    })
  }

  async getUser(): Promise<string> {
    
  }

}
