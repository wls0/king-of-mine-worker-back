import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stages {
  @ApiProperty({
    example: 1,
    description: 'stage',
    required: true,
  })
  @PrimaryGeneratedColumn()
  stage: number;

  @ApiProperty({
    example: 1,
    description: 'coal',
    required: true,
  })
  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @IsNotEmpty()
  coal: number;

  @ApiProperty({
    example: 3,
    description: 'bronze',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  bronze: number;

  @ApiProperty({
    example: 2,
    description: 'silver',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  silver: number;

  @ApiProperty({
    example: 6,
    description: 'emerald',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  emerald: number;

  @ApiProperty({
    example: 4,
    description: 'amethyst',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  amethyst: number;

  @ApiProperty({
    example: 1,
    description: 'diamond',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  diamond: number;

  @ApiProperty({
    example: 2,
    description: 'lithium',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  lithium: number;

  @ApiProperty({
    example: 1,
    description: 'useDynamite',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', default: 0 })
  useDynamite: number;
}
