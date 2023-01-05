import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.model';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Companies } from './companies.model';

@Entity()
export class CompanyUsers {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: string;

  @ApiProperty({
    example: 'dfgkjsldjrijgalmvlskmfg',
    description: 'companyIndex',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  @ManyToOne(() => Companies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyIndex' })
  companyIndex: string;

  // 6 > 5 > 4 > 3 > 2 > 1
  // 승인 미정 > 이사 > 상무 > 전무 > 부사장 > 사장
  @ApiProperty({
    example: 3,
    description: 'position',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, 5, 6])
  @Column({ type: 'int', default: 0, width: 6 })
  position: number;
}
