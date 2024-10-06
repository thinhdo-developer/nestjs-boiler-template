import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpsModule } from '../otps/otps.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfigService } from 'src/common/types';
import { GoogleStrategy, LocalStrategy } from 'src/strategies';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { FacebookStrategy } from 'src/strategies/facebook.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => OtpsModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<IConfigService>) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRES_IN')}s`,
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
