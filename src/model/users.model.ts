import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userIndex: string;

  @Column({ type: 'char', length: 10, unique: true })
  id: string;

  @Column({ type: 'varchar', length: 20 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  salt: string;

  @Column({ type: 'char', nullable: true })
  nickname: string;
}
