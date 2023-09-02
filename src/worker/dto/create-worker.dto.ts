import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class BankDetailDTO {
  @IsString()
  @IsOptional()
  bankAccountName: string;

  @IsString()
  @IsOptional()
  ifscCode: string;

  @IsString()
  @IsOptional()
  bankAccountNumber: string;
}

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  workerNo: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  alterNo: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  machineNo: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  reference: string;

  @IsString()
  @IsOptional()
  aadharNo: string;

  @IsString()
  @IsOptional()
  mobileNo: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankDetailDTO)
  bankDetails: BankDetailDTO;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  post: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  company: string;

  @IsString()
  @IsOptional()
  aadharCard: string;

  @IsString()
  @IsOptional()
  profile: string;

  @IsString()
  @IsOptional()
  bankPassbook: string;

  @IsString()
  @IsOptional()
  signature: string;

  @IsString()
  @IsOptional()
  joiningDate: string;

  @IsString()
  @IsOptional()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  blockNo: string;

  @IsString()
  @IsOptional()
  age: number;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  workers: ObjectId[];
}
