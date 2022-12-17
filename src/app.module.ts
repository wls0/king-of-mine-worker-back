import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from './model/companies.model';
import { GameRecords } from './model/game-records.mode';
import { Gifts } from './model/gifts.model';
import { Items } from './model/items.model';
import { Stages } from './model/stages.model';
import { Users } from './model/users.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [Companies, GameRecords, Gifts, Items, Stages, Users],
      synchronize: JSON.parse(process.env.MYSQL_SYNC),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
