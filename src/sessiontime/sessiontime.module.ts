import { Module } from '@nestjs/common';
import { SessiontimeController } from './sessiontime.controller';
import { SessiontimeService } from './sessiontime.service';

@Module({
  controllers: [SessiontimeController],
  providers: [SessiontimeService],
})
export class SessiontimeModule {}
