import { Module } from '@nestjs/common';
import { CircleService } from 'src/circle/circle.service';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, CircleService],
})
export class PlacesModule {}
