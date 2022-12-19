import { Module } from '@nestjs/common';
import { LogRepository } from './logs.repository';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Logs, LogsSchema } from '../model/logs.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Logs.name,
        schema: LogsSchema,
      },
    ]),
  ],
  providers: [LogsService, LogRepository],
  controllers: [LogsController],
  exports: [LogsService],
})
export class LogsModule {}
