import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'nestjs-prisma';
import { Strategy } from 'passport-strategy';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFA extends PassportStrategy(Strategy, '2fa'){
    constructor(
        private prisma: PrismaService,
        ) {
        super ({
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(payload: {username: string, code: string}): Promise<any>{
        const user = await this.prisma.user.findUnique ({
            where: {
                userName: payload.username,
            },
        });

		if (!user){
			throw new UnauthorizedException('User not found');
		}

        const secret = user.twoFASecret;
		console.log('secret: ', user.twoFASecret);
        
		const isValid = authenticator.verify({token: payload.code, secret})

        if (!isValid) {
			console.log('wrong totp');
            throw new UnauthorizedException('Invalid TOTP code');
        }

        delete user.password;
        return user;  
    }
}