import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpsService } from '../otps/otps.service';
import { OtpPurpose } from '../otps/enums';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from 'src/guards';
import { CurrentUser } from 'src/decorators';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import GoogleOAuthGuard from 'src/guards/google-oauth.guard';
import FacebookOAuthGuard from 'src/guards/facebook-oauth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpsService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const user = await this.usersService.create(userRegisterDto);
    return user.toDto();
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.otpService.verify(verifyOtpDto);

    if (verifyOtpDto.purpose === OtpPurpose.REGISTER) {
      await this.usersService.verifyEmail(verifyOtpDto.identifier);
    }

    return true;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() _req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth(@Request() _req) {}

  @Get('facebook-redirect')
  @UseGuards(FacebookOAuthGuard)
  facebookAuthRedirect(@Request() req) {
    return this.authService.facebookLogin(req);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: User) {
    return this.authService.generateAuthTokens(user);
  }
}
