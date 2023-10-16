import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Worker } from 'src/worker/schema/worker.schema';

export type LastLoginDocument = LastLogin & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class LastLogin {

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Worker.name })
  userId: Types.ObjectId;

  @Prop()
  latitude: Number;

  @Prop()
  longitude: Number;

}

export const LastLoginSchema =
  SchemaFactory.createForClass(LastLogin);
