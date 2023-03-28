import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class PlacesDto {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  userId: string;
  circleId: string;
}
