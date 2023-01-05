import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { IsNotEmpty, IsString } from 'class-validator';
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
