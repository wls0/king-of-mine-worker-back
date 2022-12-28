import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stages {
  @PrimaryGeneratedColumn()
  stage: number;

  @Column({ type: 'int', default: 0 })
  coal: number;

  @Column({ type: 'int', default: 0 })
  bronze: number;

  @Column({ type: 'int', default: 0 })
  silver: number;

  @Column({ type: 'int', default: 0 })
  gold: number;

  @Column({ type: 'int', default: 0 })
  emerald: number;

  @Column({ type: 'int', default: 0 })
  amethyst: number;

  @Column({ type: 'int', default: 0 })
  diamond: number;

  @Column({ type: 'int', default: 0 })
  lithium: number;

  @Column({ type: 'int', default: 0 })
  useDynamite: number;
}
