import { Module } from '@nestjs/common';
import { PaginationService } from 'common/pagination/pagination.service';
import { BookingsController } from './bookings.controller';
import { BookingsResolver } from './bookings.resolver';
import { BookingsService } from './bookings.service';

@Module({
  imports: [],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsResolver, PaginationService],
  exports: [BookingsService],
})
export class BookingsModule {}
