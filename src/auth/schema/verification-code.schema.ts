import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { VerificationCodeType } from '../enum/verification-code-type.enum';
import { Worker } from 'src/worker/schema/worker.schema';
import { VerificationCodeStatus } from '../enum/verification-code-status.enum';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class VerificationCode {
  @Prop({ required: true })
  code: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Worker.name })
  entity: Types.ObjectId;

  @Prop({ required: true })
  expiryAt: Date;

  @Prop({
    required: true,
    enum: VerificationCodeType,
    default: VerificationCodeType.FORGOT_PASSWORD,
  })
  type: VerificationCodeType;

  @Prop({
    required: true,
    enum: VerificationCodeStatus,
    default: VerificationCodeStatus.PENDING,
  })
  status: VerificationCodeStatus;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
