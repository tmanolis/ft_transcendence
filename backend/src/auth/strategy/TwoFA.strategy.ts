import { Injectable, NotFoundException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as TwoFAStrategy } from 'passport-2fa-totp';
import { PrismaService } from 'nestjs-prisma';
import passport from 'passport';

@Injectable()
export class TwoFA extends PassportStrategy(TwoFAStrategy, '2fa'){
    constructor(private prisma: PrismaService) {
        super ({
            usernameField: 'username',
            passwordField: 'password',
        });
        passport.use(new TwoFAStrategy({}));
    }

    async validate(username: string): Promise<any>{
        const user = await this.prisma.user.findUnique ({
            where: {
                userName: username,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user;
    }
}