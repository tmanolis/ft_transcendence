import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'nestjs-prisma';
import { Strategy } from 'passport-strategy';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFA extends PassportStrategy(Strategy, '2fa'){
    constructor(private prisma: PrismaService) {
        super ({
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(payload: any): Promise<any>{
        const { username, code } = payload;

        const user = await this.prisma.user.findUnique ({
            where: {
                userName: username,
            },
        });
        if (!user.twoFAActivated) {
            return user;
        }
        const secret = user.twoFASecret;
        const isValid = authenticator.verify({token: code, secret})
        if (!isValid) {
            throw new UnauthorizedException('Invalid TOTP code');
        }
        return UserService.excludePassword(user);
    }
}