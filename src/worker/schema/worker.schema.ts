import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';
import { Organization } from 'src/organization/schema/organization.schema';
import { Post } from 'src/post/schema/post.schema';
import { Role } from 'src/role/schema/role.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Worker {
  @Prop({
    unique: true,
  })
  workerNo: string;

  @Prop({
    unique: true,
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
    unique: true,
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
    required: true,
  })
  @Transform(({ value }) => new Types.ObjectId(value))
  post: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Role.name,
    required: true,
  })
  @Transform(({ value }) => new Types.ObjectId(value))
  role: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Organization.name,
    required: true,
  })
  @Transform(({ value }) => new Types.ObjectId(value))
  company: Types.ObjectId;

  @Prop()
  aadharCard: string;

  @Prop()
  profile: string;

  @Prop()
  bankPassbook: string;

  @Prop()
  signature: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  joiningDate: string;

  @Prop()
  blockNo: string;

  @Prop({ default: 0 })
  age: number;

  @Prop({ type: [SchemaTypes.ObjectId], ref: Worker.name })
  workers: Types.ObjectId[];

  @Prop()
  latitude: number;

  @Prop()
  longtitude: number;
}

export type WorkerDocument = Worker & Document;

export const WorkerSchema = SchemaFactory.createForClass(Worker);
