import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.model';

@Entity()
export class Companies {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user' })
  user: Users;

  @Column({ type: 'varchar', length: 20 })
  companyName: string;

  // 5 > 4 > 3 > 2 > 1
  // 이사 > 상무 > 전무 > 부사장 > 사장
  @Column({ type: 'int', default: 0, width: 5 })
  position: number;
}
