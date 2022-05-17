import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Booking } from './models/booking.model';
import { CreateBookingInput } from './dto/create-booking.input';
import { BookingsService } from './bookings.service';
import { BookingParticipantsInput } from './dto/booking-participant.input';
import { BookingParticipantsCreatedOutput } from './dto/booking-participants-created.output';
import { ApiPaginatedResponse } from 'common/pagination/api-paginated-response.decorator';
import { JWTGuard } from 'auth/jwt-guard.decorator';
import { BookingsFiltersPaginatedDto } from './dto/bookings-filters.dto';

@ApiTags('Bookings')
@Controller('bookings')
@JWTGuard()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Get all bookings.
   */
  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({
    name: 'participants',
    description: 'Filter by list of participant ids',
    required: false,
    style: 'simple',
  })
  @ApiQuery({
    name: 'active',
    description: 'Filter by active',
    required: false,
  })
  @ApiPaginatedResponse(Booking)
  bookings(
    @Query() { participants, active, skip, take }: BookingsFiltersPaginatedDto
  ) {
    return this.bookingsService.findFiltered(
      {
        participants,
        active,
      },
      { skip, take }
    );
  }

  /**
   * Create a new booking.
   */
  @Post('booking')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({ type: Booking })
  create(@Body() booking: CreateBookingInput, @Request() req) {
    return this.bookingsService.createBooking(req.user.id, booking);
  }

  /**
   * Get an individual booking.
   */
  @Get('booking/:id')
  @ApiOperation({
    summary: 'Get a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiOkResponse({ type: Booking })
  @ApiNotFoundResponse()
  async getBooking(@Param('id') id: string) {
    const booking = await this.bookingsService.findOneById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  /**
   * Add participants to a booking.
   */
  @Post('booking/:id/participants')
  @ApiOperation({
    summary: 'Add participants to a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiCreatedResponse({ type: BookingParticipantsCreatedOutput })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiUnprocessableEntityResponse()
  addParticipant(
    @Param('id') id: string,
    @Body() { participants }: BookingParticipantsInput,
    @Request() req
  ) {
    return this.bookingsService.addParticipants(id, req.user.id, participants);
  }

  /**
   * Delete a booking.
   */
  @Delete('booking/:id')
  @ApiOperation({
    summary: 'Delete a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiOkResponse({ type: Booking })
  @ApiNotFoundResponse()
  deleteBooking(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }
}
