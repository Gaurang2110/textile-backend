import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum WorkerImageType {
  PROFILE = 'profile',
  BANK_PASSBOOK = 'bank-passbook',
  AADHAR_CARD = 'aadhar-card',
  AADHAR_CARD_BACK = 'aadhar-card-back',
  SIGNATURE = 'signature',
}

export enum MediaAction {
  SIGNED_URL = 'signed-url',
  GET_LINK = 'get-link',
}

export class WorkerDierctImageDTO {
  @IsEnum(WorkerImageType)
  @IsDefined()
  type: WorkerImageType;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  workerNo: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  company: string;
}

export class WorkerImageDTO extends WorkerDierctImageDTO {
  @IsEnum(MediaAction)
  @IsDefined()
  action: MediaAction;
}
