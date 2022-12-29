import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../model/users.model';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { Items } from '../model/items.model';
import { GameRecords } from '../model/game-records.mode';
import { LogsModule } from '../logs/logs.module';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Items, GameRecords]),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: { expiresIn: '1 days' },
    }),
    LogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtStrategy],
})
export class UsersModule {}
