import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './users.model';

@Entity()
export class GameRecords {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: Users;

  @Column({ type: 'int', default: 1 })
  stage: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  exp: number;
}
