import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import { Otp } from './entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpsController],
  providers: [OtpsService],
  exports: [OtpsService],
})
export class OtpsModule {}
