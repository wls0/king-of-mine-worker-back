import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.model';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Companies {
  @PrimaryGeneratedColumn('uuid')
  index: string;

  @ApiProperty({
    example: 'companyTest',
    description: 'companyName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true, type: 'varchar', length: 20 })
  companyName: string;
}
