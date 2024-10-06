import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../constants';

export type IConfigService = Record<keyof typeof ENV_KEYS, unknown>;
