import { AbstractEntity } from 'src/common/abstracts';
import { Column, Entity } from 'typeorm';
import { OtpPurpose } from '../enums';

@Entity()
export class Otp extends AbstractEntity {
  @Column({ type: 'varchar', length: 6, nullable: false })
  code: string;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: OtpPurpose,
    nullable: false,
  })
  purpose: OtpPurpose;

  @Column({ type: 'varchar', length: 255, nullable: true })
  identifier: string; // email or phone number
}
