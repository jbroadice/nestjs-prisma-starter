import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsResolver } from './bookings.resolver';
import { BookingsService } from './bookings.service';

@Module({
  imports: [],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsResolver],
  exports: [BookingsService],
})
export class BookingsModule {}
