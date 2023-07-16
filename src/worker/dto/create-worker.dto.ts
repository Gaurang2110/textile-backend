import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class BankDetailDTO {
  @IsString()
  @IsNotEmpty()
  bankAccountName: String;

  @IsString()
  @IsNotEmpty()
  ifscCode: String;

  @IsString()
  @IsNotEmpty()
  bankAccountNumber: String;
}

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  alterNo: string;

  @IsString()
  @IsNotEmpty()
  machineNo: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  aadharNo: string;

  @IsString()
  @IsNotEmpty()
  mobileNo: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => BankDetailDTO)
  bankDetails: BankDetailDTO;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  post: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  aadharCard: string;

  @IsString()
  @IsNotEmpty()
  profile: string;

  @IsString()
  @IsNotEmpty()
  bankPassbook: string;
}
