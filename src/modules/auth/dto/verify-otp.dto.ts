import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OtpPurpose } from 'src/modules/otps/enums';

export class VerifyOtpDto {
  @ApiProperty({
    example: '123456',
    description: 'The OTP code',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    enum: OtpPurpose,
    example: OtpPurpose.REGISTER,
  })
  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose: OtpPurpose;
}
