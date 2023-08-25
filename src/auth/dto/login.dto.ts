import {
  IsDefined,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class loginDTO {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsNumber()
  @IsLatitude()
  @IsOptional()
  latitude: number;

  @IsNumber()
  @IsLongitude()
  @IsOptional()
  longtitude: number;
}
