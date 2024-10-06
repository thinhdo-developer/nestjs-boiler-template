import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { OtpPurpose } from '../enums';

export class CreateOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;

  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsNumber()
  expiresIn: number;
}
