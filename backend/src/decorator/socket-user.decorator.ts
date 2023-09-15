import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, NotFoundException, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { Cache } from 'cache-manager';
import { ChatUser } from 'src/dto';

export const SocketUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const jwt = client.handshake.headers.authorization;

    if (jwt === 'undefined' || jwt === null) {
			throw new UnauthorizedException('Authentification failed, please log in again.');
    }

		const jwtService = new JwtService({});
		const user: { sub: string; email: string; iat: string; exp: string } | any = jwtService.decode(jwt);
		if (user){
			const email = user.email;
			const connectedUser = fetchUser(email);
			if (!connectedUser){
				throw new NotFoundException('Account has been deleted, new registration needed.')
			} else {
				return connectedUser;
			}
		}
  },
);

async function fetchUser(email: string): Promise<ChatUser | null>{
	const cacheUser: string = await this.cacheManager.get('chat' + email);
	if (cacheUser){
		const existingUser: ChatUser = JSON.parse(cacheUser);
		return existingUser;
	} 
	
	return null;
}
