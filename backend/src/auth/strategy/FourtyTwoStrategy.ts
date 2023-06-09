import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
// axios and rxjs are used for direct api request
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
// for env
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dto';
import axios from 'axios';

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

      callbackURL: 'http://localhost:3000/auth/fourtytwo/callback',
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
    user.image = await this.fetchImage(userData.image.link);
    user.password = '';

    return cb(null, user, accessToken);
  }

  async fetchImage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      if (response.status === 200) {
        const imageBuffer = Buffer.from(response.data, 'binary');
        const returnString = imageBuffer.toString('base64');
        return returnString;
      }
    } catch (error) {
      throw new NotFoundException('Could not load profile picture.')
    }
    return null;
  }
}
