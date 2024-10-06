import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
