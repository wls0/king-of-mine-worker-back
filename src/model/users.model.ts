import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsNotEmpty()
  userIndex: string;

  @ApiProperty({
    example: 'testID',
    description: 'id',
    required: true,
  })
  @Column({ type: 'varchar', length: 10, unique: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'pwd123', description: 'password', required: true })
  @Column({ type: 'varchar', length: 128 })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @IsNotEmpty()
  salt: string;

  @ApiProperty({
    example: 'testNickname',
    description: 'nickname',
    required: true,
  })
  @Column({ type: 'varchar', nullable: true, default: null })
  @IsString()
  nickname: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  status: boolean;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  accessLevel: boolean;
}
