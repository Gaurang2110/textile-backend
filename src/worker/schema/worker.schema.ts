import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';

@Schema({
  timestamps: true,
})
export class Worker {
  @Prop({
    unique: true
  })
  alterNo: string;

  @Prop()
  machineNo: string;

  @Prop()
  name: string;

  @Prop()
  reference: string;

  @Prop()
  aadharNo: string;

  @Prop()
  mobileNo: string;

  @Prop({
    unique: true
  })
  emailAddress: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop({
    type: {
      bankAccountName: String,
      IfscCode: String,
      bankAccountNumber: String,
    },
  })
  bankDetails: {
    bankAccountName: string;
    IfscCode: string;
    bankAccountNumber: string;
  };

  @Prop()
  status: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Post.name,
  })
  @Transform(({ value }) => new Types.ObjectId(value))  
  post: Types.ObjectId;
}

export type WorkerDocument = Worker & Document;

export const WorkerSchema = SchemaFactory.createForClass(Worker);
