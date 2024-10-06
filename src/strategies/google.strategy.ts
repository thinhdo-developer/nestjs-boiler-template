import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { IConfigService } from 'src/common/types';
import { ConfigService } from '@nestjs/config';
import { GoogleUserProfile } from 'src/modules/auth/interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService<IConfigService>) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID_WEB'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET_WEB'),
      callbackURL: `${configService.get('HOST')}/api/v1/auth/google-redirect`,
      scope: ['email', 'profile', 'openid'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: GoogleUserProfile = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
