import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../model/users.model';
import { Logs, LogsSchema } from '../model/logs.model';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { Stages } from '../model/stages.model';
import { Items } from '../model/items.model';
import { GameRecords } from '../model/game-records.mode';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Stages, Items, GameRecords]),
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
