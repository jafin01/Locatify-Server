import { IsNotEmpty, IsString } from 'class-validator';

export class CircleDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  circleCode: string;
  description: string;
  userId: string;
}
