import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class FacebookOAuthGuard extends AuthGuard('facebook') {
  constructor(private configService: ConfigService) {
    super();
  }
}
