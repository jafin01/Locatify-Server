import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @MinLength(4)
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
  isActive: boolean;
}
