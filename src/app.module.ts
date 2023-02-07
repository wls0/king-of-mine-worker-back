import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from './model/companies.model';
import { CompanyUsers } from './model/company-users.model';
import { GameRecords } from './model/game-records.model';
import { Gifts } from './model/gifts.model';
import { Items } from './model/items.model';
import { Stages } from './model/stages.model';
import { Users } from './model/users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { CommunitiesModule } from './communities/communities.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { ManagesModule } from './manages/manages.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoginSocketsModule } from './login-sockets/login-sockets.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [
        Companies,
        GameRecords,
        Gifts,
        Items,
        Stages,
        Users,
        CompanyUsers,
      ],
      synchronize: JSON.parse(process.env.MYSQL_SYNC),
    }),
    LogsModule,
    UsersModule,
    GamesModule,
    CommunitiesModule,
    CompaniesModule,
    AuthModule,
    ManagesModule,
    LoginSocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
