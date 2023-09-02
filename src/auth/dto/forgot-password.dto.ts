import { IsDefined, IsEmail, IsMongoId, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  @IsDefined()
  email: string;
}

export class UpdatePasswordDTO extends ForgotPasswordDTO {
  @IsMongoId()
  id: string;

  @IsString()
  code: string;

  @IsString()
  password: string;
}
