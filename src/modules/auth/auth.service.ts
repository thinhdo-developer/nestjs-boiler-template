import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IAccessToken } from './interfaces/access_token.interface';
import { IRefreshToken } from './interfaces/refresh_token.interface';
import { GoogleUserProfile } from './interfaces';
import { OAuthProvider } from './enums/oauth_provider.enum';
import { FacebookUserProfile } from './interfaces/facebook_user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAuthTokens(user: User) {
    // Generate and return the access and refresh tokens
    const access_token = await this.jwtService.signAsync({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    } as IAccessToken);

    const refresh_token = await this.jwtService.signAsync({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    } as IRefreshToken);

    await this.usersService.update(user.id, { refreshToken: refresh_token });

    return {
      access_token,
      refresh_token,
    };
  }

  async googleLogin(req: { user: GoogleUserProfile }) {
    if (!req.user) {
      return 'No user from google';
    }

    const user = await this.usersService.createUserWithOauth({
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.picture,
      provider: OAuthProvider.GOOGLE,
      providerId: '',
    });

    return this.generateAuthTokens(user);
  }

  async facebookLogin(req: { user: FacebookUserProfile }) {
    if (!req.user) {
      return 'No user from facebook';
    }
    const user = await this.usersService.createUserWithOauth({
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      provider: OAuthProvider.FACEBOOK,
      providerId: '',
    });

    return this.generateAuthTokens(user);
  }
}
