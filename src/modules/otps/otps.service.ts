import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { generateOtp } from 'src/utils';
import { VerifyOtp } from './interfaces';

@Injectable()
export class OtpsService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}
  create(createOtpDto: CreateOtpDto) {
    const { expiresIn, ...otpData } = createOtpDto;

    const otp = this.otpRepository.create({
      ...otpData,
      code: generateOtp(6).toString(),
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });
    return this.otpRepository.save(otp);
  }

  async verify(data: VerifyOtp) {
    const { code, identifier, purpose } = data;

    const otp = await this.otpRepository.findOne({
      where: { code, identifier, purpose },
    });

    if (!otp) {
      throw new NotFoundException('OTP not found');
    }

    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
  }
}
