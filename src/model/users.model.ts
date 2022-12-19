import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userIndex: string;

  @ApiProperty({
    example: 'testID',
    description: 'id',
    required: true,
  })
  @Column({ type: 'varchar', length: 10, unique: true })
  id: string;

  @ApiProperty({ example: 'pwd123', description: 'password', required: true })
  @Column({ type: 'varchar', length: 20 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  salt: string;

  @ApiProperty({
    example: 'testNickname',
    description: 'nickname',
    required: true,
  })
  @Column({ type: 'varchar', nullable: true })
  nickname: string;
}
