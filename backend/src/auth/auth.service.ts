import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
	constructor (
		private prisma: PrismaService,
	) {}

	async handle42Login(res: any, dto: AuthDto): Promise<string> {	
		const user = await this.prisma.user.findUnique({
			where: {
				id: dto.id,
			},
		})
		
		if (!user){
			try {
				const user = await this.prisma.user.create({
					data: {
						id: dto.id,
						email: dto.email,
						userName: dto.userName,
						avatar: dto.image,
						isFourtyTwoStudent: true,
						hash: dto.hash,
					}
				})
				// console.log('new user', user);
			}catch (error) {
				throw error;  
			}
		} else {
			user.hash = dto.hash;
			// console.log('existing user', user);
		}
		res.cookie('access_token', dto.hash).redirect('/hello');
		return 'OK!';
	  }
}
