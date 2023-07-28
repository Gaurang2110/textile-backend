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
  bankAccountName: string;

  @IsString()
  @IsNotEmpty()
  ifscCode: string;

  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;
}

export class CreateWorkerDto {
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
  @IsNotEmpty()
  @IsDefined()
  reference: string;

  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  aadharNo: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
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
  @IsDefined()
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
  @IsNotEmpty()
  @IsDefined()
  aadharCard: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  profile: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  bankPassbook: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  signature: string;
}
