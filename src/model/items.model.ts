import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './users.model';

@Entity()
export class Items {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: string;

  @Column({ type: 'int', default: 1 })
  drill: number;

  @Column({ type: 'int', default: 1 })
  oxygenRespirator: number;

  @Column({ type: 'int', default: 1 })
  dynamite: number;

  @Column({ type: 'int', default: 1 })
  coworker: number;

  @Column({ type: 'int', default: 0 })
  gold: number;
}
