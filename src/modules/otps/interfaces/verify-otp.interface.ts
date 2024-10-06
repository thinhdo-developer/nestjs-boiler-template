import { OtpPurpose } from '../enums';

export interface VerifyOtp {
  code: string;
  identifier: string;
  purpose: OtpPurpose;
}
