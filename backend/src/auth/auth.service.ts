import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
	constructor (
		private prisma: PrismaService,
	) {}

	// async createUser(dto: AuthDto) {
	// 	console.log('req.user', AuthDto);
	// }
	async handle42Login(res: any, req: any): Promise<string> {
		res.cookie('access_token', req.user).redirect('/hello');
		
		const hash = await argon.hash(req.user.accessToken);
		
		const user = await this.prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
		})
		
		if (!user){
			try {
				const user = await this.prisma.user.create({
					data: {
						id: req.user.id,
						email: req.user.email,
						userName: req.user.login,
						avatar: req.user.image,
						isFourtyTwoStudent: true,
						hash,
					}
				})
			}catch (error) {
				throw error;
			}
		}
		console.log(user);
		return 'OK!';
	  }
}
