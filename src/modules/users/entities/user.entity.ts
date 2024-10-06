import { AbstractEntity } from 'src/common/abstracts';
import { OAuthProvider } from 'src/modules/auth/enums/oauth_provider.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: true, type: 'varchar' })
  firstName: string;

  @Column({ nullable: true, type: 'varchar' })
  lastName: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  avatar: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string;

  @Column({ type: 'enum', enum: OAuthProvider, nullable: true })
  oauthProvider: OAuthProvider;

  @Column({ nullable: true, type: 'varchar' })
  oauthId: string;
}
