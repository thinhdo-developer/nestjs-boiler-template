import { Controller } from '@nestjs/common';
import { OtpsService } from './otps.service';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}
}
