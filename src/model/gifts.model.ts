import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.model';

@Entity()
export class Gifts {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @ManyToOne(() => Users, (users) => users.userIndex)
  @JoinColumn({ name: 'sendUser' })
  sendUser: Users;

  @Column({ type: 'varchar', length: 36 })
  receiveUser: string;

  @Column({ type: 'int', default: 0 })
  gold: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  message: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;
}
