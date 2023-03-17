import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @MinLength(10)
  @IsNotEmpty()
  @IsString()
  mobileNo: string;

  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  hashedRefreshToken: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  locationTitle: string;
}
