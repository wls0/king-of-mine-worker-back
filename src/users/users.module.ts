import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../model/users.model';
import { Logs, LogsSchema } from '../model/logs.model';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    MongooseModule.forFeature([{ name: Logs.name, schema: LogsSchema }]),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: { expiresIn: '1 days' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
