import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { OAuthProvider } from 'src/modules/auth/enums/oauth_provider.enum';

export class CreateOAuthUserDto {
  @IsNotEmpty()
  @IsString()
  provider: OAuthProvider;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  avatar?: string;
}
