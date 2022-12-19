import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const options = {
  timestamps: true,
  collection: 'logs',
};

const expire = 1000 * 60 * 60 * 24 * 30 * 12;
@Schema(options)
export class Logs extends Document {
  @Prop({
    required: true,
    default: [],
  })
  accountLog: any[];

  @Prop({
    required: true,
    default: [],
  })
  stageLog: any[];

  @Prop({
    required: true,
    default: [],
  })
  itemLog: any[];

  @Prop({
    required: true,
    default: [],
  })
  companyLog: any[];

  @Prop({
    required: true,
  })
  user: string;

  @Prop({
    required: true,
  })
  date: string;

  @Prop({ default: Date.now() + expire })
  expireAt: Date;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
