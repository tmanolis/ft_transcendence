import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto/auth.dto';

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
		console.log(req.user);
		return 'OK!';
	  }
}
