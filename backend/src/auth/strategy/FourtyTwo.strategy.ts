import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
// axios and rxjs are used for direct api request
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
// for env
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../../dto';

@Injectable()
export class FourtyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    super({
      authorizationURL: config.get('AUTH_URL'),
      tokenURL: config.get('TOKEN_URL'),
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ): Promise<any> {
    let userData;
    try {
      userData = (
        await lastValueFrom(
          this.httpService.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: 'Bearer ' + accessToken },
          }),
        )
      ).data;
    } catch (error) {
      throw error;
    }

    const user = new AuthDto();

    user.id = userData.id.toString();
    user.userName = userData.login;
    user.email = userData.email;
    user.image = userData.image.link;
    user.password = '';

    return cb(null, user, accessToken);
  }
}
