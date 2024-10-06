import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UUID } from 'crypto';
import { AbstractDto } from './dto.abstract';

/**
 * Abstract Entity
 * @description This class is an abstract class for all entities.
 * It's experimental and recommended using it only in microservice architecture,
 * otherwise just delete and use your own entity.
 */
export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt!: Date;

  toDto(options?: O): DTO {
    const dtoClass = this.constructor.prototype.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}
