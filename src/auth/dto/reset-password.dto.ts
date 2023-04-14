import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
