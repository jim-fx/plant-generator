import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { IsOptional } from 'class-validator';
import { BaseEntity } from '../entities/BaseEntity';
import { User } from '../user/user.entity';
import { PLabel } from './dto/shared-types';


@Entity()
export class Report extends BaseEntity {
  @Property()
  type: 'bug' | 'feat';

  @IsOptional()
  @Property({ type: 'json' })
  labels: PLabel[] = [];

  @OneToOne({ nullable: true })
  author?: User = null;

  @Property()
  title: string;

  @Property()
  gh_issue?: number;

  @Property()
  open = true;

  @Property()
  description?: string;

  @Property()
  stacktrace?: any;

  @Property({ type: "json" })
  logs?: any

  @Property({ type: 'json' })
  browser?: any;
}
