import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'src/utils';
import { OtpsService } from '../otps/otps.service';
import { OtpPurpose } from '../otps/enums';
import { UUID } from 'crypto';
import { CreateOAuthUserDto } from './dto/create-oauth-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpsService: OtpsService,
  ) {}

  async create(createUserDto: UserRegisterDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser?.isEmailVerified) {
      throw new BadRequestException('User with verified email already exists.');
    }

    if (existingUser) {
      // Handle the case where the user exists but email is not verified
      await existingUser.remove();
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.otpsService.create({
      identifier: user.email,
      purpose: OtpPurpose.REGISTER,
      expiresIn: 1000 * 60 * 60 * 24,
    });

    return user;
  }

  async createUserWithOauth(data: CreateOAuthUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const user = await this.userRepository.save({
      ...data,
      password: null,
      oauthProvider: data.provider,
    });

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async verifyEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    user.isEmailVerified = true;
    return await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string) {
    if (!email || !password) {
      throw new UnprocessableEntityException('Invalid email or password');
    }

    const user = await this.findByEmail(email);
    if (!user || !user.isEmailVerified) {
      throw new UnprocessableEntityException('User not found');
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid password');
    }
    return user;
  }

  async update(id: UUID, updateUserDto: Partial<Omit<User, 'id'>>) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }
}
