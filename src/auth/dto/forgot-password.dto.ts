import { IsDefined, IsEmail, IsMongoId, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  @IsDefined()
  email: string;
}

export class UpdatePasswordDTO extends ForgotPasswordDTO {

  @IsString()
  password: string;
}

export class VerifyCodeDTO extends ForgotPasswordDTO {
  @IsMongoId()
  id: string;

  @IsString()
  code: string;

}
