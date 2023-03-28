import { IsOptional } from 'class-validator';

export class CircleMembersDto {
  userId: string;
  circleId: string;
  @IsOptional()
  role: string;
}
