import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ENV_KEYS } from './common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IConfigService } from './common/types';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Otp } from './modules/otps/entities/otp.entity';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        [ENV_KEYS.PORT]: Joi.number().required(),
        [ENV_KEYS.DB_HOST]: Joi.string().required(),
        [ENV_KEYS.DB_PORT]: Joi.number().required(),
        [ENV_KEYS.DB_USER]: Joi.string().required(),
        [ENV_KEYS.DB_PASSWORD]: Joi.string().required(),
        [ENV_KEYS.DB_NAME]: Joi.string().required(),
        [ENV_KEYS.JWT_SECRET]: Joi.string().required(),
        [ENV_KEYS.JWT_EXPIRES_IN]: Joi.number().required(),
        [ENV_KEYS.EMAIL_HOST]: Joi.string().required(),
        [ENV_KEYS.EMAIL_PORT]: Joi.number().required(),
        [ENV_KEYS.EMAIL_USER]: Joi.string().required(),
        [ENV_KEYS.EMAIL_PASSWORD]: Joi.string().required(),
        [ENV_KEYS.EMAIL_FROM]: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService<IConfigService>) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User, Otp],
          synchronize: true,
          ssl: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
